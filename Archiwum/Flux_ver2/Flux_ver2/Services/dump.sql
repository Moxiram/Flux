---- Tworzenie bazy danych SQLite dla zarz¹dzania logistyk¹

---- Tabela u¿ytkowników
--CREATE TABLE Users (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT
--    Name TEXT NOT NULL,
--    Email TEXT NOT NULL UNIQUE,
--    PasswordHash TEXT NOT NULL,
--    Role TEXT NOT NULL
--);

---- Tabela klientów
--CREATE TABLE Customers (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT
--    Name TEXT NOT NULL
--);

---- Tabela adresów i danych kontaktowych klientów
--CREATE TABLE CustomerAddresses (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT
--    CustomerId INTEGER NOT NULL,
--    Address TEXT NOT NULL,
--    Contact TEXT NOT NULL,
--    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
--);

---- Tabela zamówieñ
--CREATE TABLE Orders (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    CustomerId INTEGER NOT NULL,
--    OrderDate TEXT NOT NULL,
--    Status TEXT NOT NULL,
--    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
--);

---- Tabela szczegó³ów zamówieñ
--CREATE TABLE OrderDetails (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    OrderId INTEGER NOT NULL,
--    ProductId INTEGER NOT NULL,
--    Quantity INTEGER NOT NULL,
--    UnitPrice REAL NOT NULL,
--    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
--    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
--);

---- Tabela produktów
--CREATE TABLE Products (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    Name TEXT NOT NULL,
--    Description TEXT,
--    Price REAL NOT NULL
--);

---- Tabela magazynów
--CREATE TABLE Warehouses (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    Name TEXT NOT NULL,
--    Location TEXT NOT NULL
--);

---- Tabela stanów magazynowych
--CREATE TABLE WarehouseStock (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    WarehouseId INTEGER NOT NULL,
--    ProductId INTEGER NOT NULL,
--    StockQuantity INTEGER NOT NULL,
--    FOREIGN KEY (WarehouseId) REFERENCES Warehouses(Id) ON DELETE CASCADE,
--    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
--);

---- Tabela ruchów magazynowych
--CREATE TABLE StockMovements (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    ProductId INTEGER NOT NULL,
--    WarehouseId INTEGER NOT NULL,
--    Quantity INTEGER NOT NULL,
--    MovementDate TEXT NOT NULL,
--    MovementType TEXT NOT NULL, -- Przyjêcie, Wydanie, Transfer
--    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
--    FOREIGN KEY (WarehouseId) REFERENCES Warehouses(Id) ON DELETE CASCADE
--);

---- Tabela pojazdów
--CREATE TABLE Vehicles (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    RegistrationNumber TEXT NOT NULL,
--    Type TEXT NOT NULL,
--    Capacity REAL NOT NULL
--);

---- Tabela kierowców
--CREATE TABLE Drivers (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    Name TEXT NOT NULL,
--    LicenseNumber TEXT NOT NULL,
--    Phone TEXT NOT NULL
--);

---- Tabela tras dostaw
--CREATE TABLE Routes (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    OrderId INTEGER NOT NULL,
--    DriverId INTEGER NOT NULL,
--    VehicleId INTEGER NOT NULL,
--    StartLocation TEXT NOT NULL,
--    EndLocation TEXT NOT NULL,
--    PlannedDate TEXT NOT NULL,
--    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
--    FOREIGN KEY (DriverId) REFERENCES Drivers(Id) ON DELETE CASCADE,
--    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id) ON DELETE CASCADE
--);
