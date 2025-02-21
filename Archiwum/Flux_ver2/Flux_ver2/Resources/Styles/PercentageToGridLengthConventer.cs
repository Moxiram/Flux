using System;
using System.Globalization;
using Microsoft.Maui.Controls;

namespace Flux_ver2.Resources.Styles
{
    public class PercentageToGridLengthConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is float fillPercentage)
            {
                // Sprawdź czy wartość jest poprawna liczbowo
                if (float.IsNaN(fillPercentage) || float.IsInfinity(fillPercentage))
                {
                    fillPercentage = 0f;
                }

                // Jeśli wartości są większe niż 1 (np. 70 zamiast 0.7), podziel przez 100, aby uzyskać ułamek
                if (fillPercentage > 1f)
                {
                    fillPercentage = fillPercentage / 100f;
                }

                // Przycięcie wartości do zakresu [0,1]
                fillPercentage = Math.Clamp(fillPercentage, 0f, 1f);

                float multiplier = 1.0f;
                if (parameter is string paramStr && float.TryParse(paramStr, out float paramVal))
                {
                    multiplier = paramVal;
                }

                // Zwróć obliczoną długość kolumny
                return new GridLength(fillPercentage * multiplier, GridUnitType.Star);
            }
            return new GridLength(0, GridUnitType.Star);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }


    public class ComplementaryPercentageToGridLengthConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is float fillPercentage)
            {
                // Sprawdź czy wartość jest poprawna liczbowo
                if (float.IsNaN(fillPercentage) || float.IsInfinity(fillPercentage))
                {
                    fillPercentage = 0f;
                }

                // Jeśli wartości są większe niż 1 (np. 70 zamiast 0.7), podziel przez 100, aby uzyskać ułamek
                if (fillPercentage > 1f)
                {
                    fillPercentage = fillPercentage / 100f;
                }

                // Przycięcie wartości do zakresu [0,1]
                fillPercentage = Math.Clamp(fillPercentage, 0f, 1f);

                // Zwróć długość kolumny będącej uzupełnieniem do 1
                return new GridLength(1 - fillPercentage, GridUnitType.Star);
            }

            // Jeśli wejście nie jest poprawnym floatem, zwróć domyślną wartość
            return new GridLength(1, GridUnitType.Star);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
