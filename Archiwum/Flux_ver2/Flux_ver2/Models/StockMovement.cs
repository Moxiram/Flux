using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace Flux_ver2.Models
{
    public class StockMovement
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int WarehouseId { get; set; }
        public int Quantity { get; set; }
        public string MovementDate { get; set; }
        public string MovementType { get; set; } // Example: "Receipt", "Issue", "Transfer"
    }
}
