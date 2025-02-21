using Flux_ver2.Models;

namespace Flux_ver2
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            BindingContext = new MainPageViewModel();
        }

        // Placeholder method for navigation buttons
        private async void OnNavigationButtonClicked(object sender, EventArgs e)
        {
            var button = sender as Button;
            if (button != null)
            {
                string destination = button.Text;
                await DisplayAlert("Navigation", $"Navigating to {destination}", "OK");
                // Implement navigation logic here
            }
        }

        // Method for Search button in Track Shipment section
        private async void OnSearchButtonClicked(object sender, EventArgs e)
        {
            // Add your search logic here
            await DisplayAlert("Search", "Searching for tracking details...", "OK");
        }

        // Example for handling checkbox changes
        private void OnCheckBoxChanged(object sender, CheckedChangedEventArgs e)
        {
            var checkBox = sender as CheckBox;
            if (checkBox != null)
            {
                string type = checkBox.BindingContext as string;
                if (e.Value)
                {
                    Console.WriteLine($"{type} selected");
                }
                else
                {
                    Console.WriteLine($"{type} deselected");
                }
            }
        }
    }
}
