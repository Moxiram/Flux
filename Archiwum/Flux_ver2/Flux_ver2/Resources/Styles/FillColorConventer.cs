using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Maui.Graphics;

namespace Flux_ver2.Resources.Styles
{
    public class FillColorConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is float fillPercentage)
            {
                if (fillPercentage > 95)
                    return Color.FromRgb(255, 0, 0); // Red
                else if (fillPercentage > 70)
                    return Color.FromRgb(255, 255, 0); // Yellow
                else
                    return Color.FromRgb(0, 128, 0); // Green
            }
            return Color.FromRgb(128, 128, 128); // Gray as fallback
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
