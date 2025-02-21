using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using SQLite;
using Flux_ver2.Models;

namespace LogisticsApp.Services
{
    public class DatabaseService
    {
        private SQLiteAsyncConnection _database;

        // Initialize the database connection
        public async Task InitializeAsync(string dbPath)
        {
            if (string.IsNullOrWhiteSpace(dbPath))
                throw new ArgumentException("Database path cannot be null or empty", nameof(dbPath));

            _database = new SQLiteAsyncConnection(dbPath);

            // Create tables
            await _database.CreateTableAsync<User>();
            await _database.CreateTableAsync<Customer>();
            await _database.CreateTableAsync<CustomerAddress>();
            await _database.CreateTableAsync<Order>();
            await _database.CreateTableAsync<OrderDetail>();
            await _database.CreateTableAsync<Product>();
            await _database.CreateTableAsync<Warehouse>();
            await _database.CreateTableAsync<WarehouseStock>();
            await _database.CreateTableAsync<StockMovement>();
            await _database.CreateTableAsync<Vehicle>();
            await _database.CreateTableAsync<Driver>();
            await _database.CreateTableAsync<Route>();
        }

        // Add a new customer
        public async Task<int> AddCustomerAsync(Customer customer)
        {
            if (customer == null)
                throw new ArgumentNullException(nameof(customer));

            return await _database.InsertAsync(customer);
        }

        // Add a new product
        public async Task<int> AddProductAsync(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            return await _database.InsertAsync(product);
        }

        // Get all customers
        public async Task<List<Customer>> GetAllCustomersAsync()
        {
            return await _database.Table<Customer>().ToListAsync();
        }

        // Get stock for a specific product in a specific warehouse
        public async Task<WarehouseStock> GetProductStockAsync(int productId, int warehouseId)
        {
            return await _database.Table<WarehouseStock>()
                .Where(ws => ws.ProductId == productId && ws.WarehouseId == warehouseId)
                .FirstOrDefaultAsync();
        }

        // Update stock quantity in a warehouse
        public async Task<int> UpdateProductStockAsync(int productId, int warehouseId, int newQuantity)
        {
            var stock = await GetProductStockAsync(productId, warehouseId);
            if (stock != null)
            {
                stock.StockQuantity = newQuantity;
                return await _database.UpdateAsync(stock);
            }
            else
            {
                // If stock entry doesn't exist, create one
                return await _database.InsertAsync(new WarehouseStock
                {
                    ProductId = productId,
                    WarehouseId = warehouseId,
                    StockQuantity = newQuantity
                });
            }
        }

        // Add an order
        public async Task<int> AddOrderAsync(Order order)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            return await _database.InsertAsync(order);
        }

        // Get all products
        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _database.Table<Product>().ToListAsync();
        }


        // Add a new warehouse
        public async Task<int> AddWarehouseAsync(Warehouse warehouse)
        {
            if (warehouse == null)
                throw new ArgumentNullException(nameof(warehouse));
            return await _database.InsertAsync(warehouse);
        }

        // Get all warehouses
        public async Task<List<Warehouse>> GetAllWarehousesAsync()
        {
            return await _database.Table<Warehouse>().ToListAsync();
        }

        // Get warehouse by ID
        public async Task<Warehouse> GetWarehouseByIdAsync(int warehouseId)
        {
            return await _database.Table<Warehouse>()
                .Where(w => w.Id == warehouseId)
                .FirstOrDefaultAsync();
        }

        // Update warehouse details
        public async Task<int> UpdateWarehouseAsync(Warehouse warehouse)
        {
            if (warehouse == null)
                throw new ArgumentNullException(nameof(warehouse));
            return await _database.UpdateAsync(warehouse);
        }

        // Delete warehouse
        public async Task<int> DeleteWarehouseAsync(int warehouseId)
        {
            return await _database.DeleteAsync<Warehouse>(warehouseId);
        }

        // Get all stock in a specific warehouse
        public async Task<List<WarehouseStock>> GetWarehouseInventoryAsync(int warehouseId)
        {
            return await _database.Table<WarehouseStock>()
                .Where(ws => ws.WarehouseId == warehouseId)
                .ToListAsync();
        }

        // Get detailed warehouse inventory with product information
        public async Task<List<(WarehouseStock Stock, Product Product)>> GetDetailedWarehouseInventoryAsync(int warehouseId)
        {
            var stocks = await GetWarehouseInventoryAsync(warehouseId);
            var result = new List<(WarehouseStock Stock, Product Product)>();

            foreach (var stock in stocks)
            {
                var product = await _database.Table<Product>()
                    .Where(p => p.Id == stock.ProductId)
                    .FirstOrDefaultAsync();

                if (product != null)
                {
                    result.Add((stock, product));
                }
            }

            return result;
        }

        // Transfer stock between warehouses
        public async Task<bool> TransferStockBetweenWarehousesAsync(
     int sourceWarehouseId,
     int destinationWarehouseId,
     int productId,
     int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be positive", nameof(quantity));

            // Begin transaction
            await _database.RunInTransactionAsync(async (SQLiteConnection tran) =>
            {
                // Check source warehouse stock
                var sourceStock = await GetProductStockAsync(productId, sourceWarehouseId);
                if (sourceStock == null || sourceStock.StockQuantity < quantity)
                    throw new InvalidOperationException("Insufficient stock in source warehouse");

                // Update source warehouse stock
                await UpdateProductStockAsync(productId, sourceWarehouseId, sourceStock.StockQuantity - quantity);

                // Update destination warehouse stock
                var destStock = await GetProductStockAsync(productId, destinationWarehouseId);
                int newDestQuantity = (destStock?.StockQuantity ?? 0) + quantity;
                await UpdateProductStockAsync(productId, destinationWarehouseId, newDestQuantity);

                // Record stock movement
                var movement = new StockMovement
                {
                    ProductId = productId,
                    WarehouseId = sourceWarehouseId,
                    Quantity = -quantity,
                    MovementDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    MovementType = "Transfer"
                };
                await _database.InsertAsync(movement);

                var destinationMovement = new StockMovement
                {
                    ProductId = productId,
                    WarehouseId = destinationWarehouseId,
                    Quantity = quantity,
                    MovementDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    MovementType = "Transfer"
                };
                await _database.InsertAsync(destinationMovement);
            });

            return true;
        }

        // Get stock movements history for a warehouse
        public async Task<List<StockMovement>> GetWarehouseMovementsAsync(
            int warehouseId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var query = _database.Table<StockMovement>()
                .Where(sm => sm.WarehouseId == warehouseId);

            if (startDate.HasValue)
            {
                string startDateStr = startDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
                query = query.Where(sm => sm.MovementDate.CompareTo(startDateStr) >= 0);
            }

            if (endDate.HasValue)
            {
                string endDateStr = endDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
                query = query.Where(sm => sm.MovementDate.CompareTo(endDateStr) <= 0);
            }

            return await query.OrderByDescending(sm => sm.MovementDate).ToListAsync();
        }


    }
}