using Flux_ver1.Models;
using Flux_ver1.PageModels;

namespace Flux_ver1.Pages
{
    public partial class MainPage : ContentPage
    {
        public MainPage(MainPageModel model)
        {
            InitializeComponent();
            BindingContext = model;
        }
    }
}