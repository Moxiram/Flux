using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace Flux_ver2.Models
{
    public class MainPageViewModel
    {
        public ObservableCollection<Warehouse> Warehouses { get; set; }

        public MainPageViewModel()
        {
            Warehouses = new ObservableCollection<Warehouse>
            {
                new Warehouse { Name = "Warehouse S", FillPercentage = 0 },
                new Warehouse { Name = "Warehouse P", FillPercentage = 70 },
                new Warehouse { Name = "Warehouse Q", FillPercentage = 80 },
                new Warehouse { Name = "Warehouse R", FillPercentage = 30 },
                new Warehouse { Name = "Warehouse A", FillPercentage = 15 },
                new Warehouse { Name = "Warehouse C", FillPercentage = 98 }
            };
        }
    }
}
