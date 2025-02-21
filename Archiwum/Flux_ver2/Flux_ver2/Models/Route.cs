using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace Flux_ver2.Models
{
    public class Route
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int DriverId { get; set; }
        public int VehicleId { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public string PlannedDate { get; set; }
    }
}
