---- Tworzenie bazy danych SQLite dla zarz�dzania logistyk�

---- Tabela u�ytkownik�w
--CREATE TABLE Users (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT
--    Name TEXT NOT NULL,
--    Email TEXT NOT NULL UNIQUE,
--    PasswordHash TEXT NOT NULL,
--    Role TEXT NOT NULL
--);

---- Tabela klient�w
--CREATE TABLE Customers (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT
--    Name TEXT NOT NULL
--);

---- Tabela adres�w i danych kontaktowych klient�w
--CREATE TABLE CustomerAddresses (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT
--    CustomerId INTEGER NOT NULL,
--    Address TEXT NOT NULL,
--    Contact TEXT NOT NULL,
--    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
--);

---- Tabela zam�wie�
--CREATE TABLE Orders (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    CustomerId INTEGER NOT NULL,
--    OrderDate TEXT NOT NULL,
--    Status TEXT NOT NULL,
--    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
--);

---- Tabela szczeg��w zam�wie�
--CREATE TABLE OrderDetails (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    OrderId INTEGER NOT NULL,
--    ProductId INTEGER NOT NULL,
--    Quantity INTEGER NOT NULL,
--    UnitPrice REAL NOT NULL,
--    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
--    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
--);

---- Tabela produkt�w
--CREATE TABLE Products (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    Name TEXT NOT NULL,
--    Description TEXT,
--    Price REAL NOT NULL
--);

---- Tabela magazyn�w
--CREATE TABLE Warehouses (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    Name TEXT NOT NULL,
--    Location TEXT NOT NULL
--);

---- Tabela stan�w magazynowych
--CREATE TABLE WarehouseStock (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    WarehouseId INTEGER NOT NULL,
--    ProductId INTEGER NOT NULL,
--    StockQuantity INTEGER NOT NULL,
--    FOREIGN KEY (WarehouseId) REFERENCES Warehouses(Id) ON DELETE CASCADE,
--    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
--);

---- Tabela ruch�w magazynowych
--CREATE TABLE StockMovements (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    ProductId INTEGER NOT NULL,
--    WarehouseId INTEGER NOT NULL,
--    Quantity INTEGER NOT NULL,
--    MovementDate TEXT NOT NULL,
--    MovementType TEXT NOT NULL, -- Przyj�cie, Wydanie, Transfer
--    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
--    FOREIGN KEY (WarehouseId) REFERENCES Warehouses(Id) ON DELETE CASCADE
--);

---- Tabela pojazd�w
--CREATE TABLE Vehicles (
--    Id INTEGER PRIMARY KEY AUTOINCREMENT,
--    RegistrationNumber TEXT NOT NULL,
--    Type TEXT NOT NULL,
--    Capacity REAL NOT NULL
--);

---- Tabela kierowc�w
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
