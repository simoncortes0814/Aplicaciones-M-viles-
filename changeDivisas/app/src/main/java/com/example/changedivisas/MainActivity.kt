package com.example.changedivisas

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.changedivisas.ui.ExchangeRateViewModel
import com.example.changedivisas.ui.theme.ChangeDivisasTheme
import androidx.compose.foundation.clickable

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ChangeDivisasTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ExchangeRateScreen()
                }
            }
        }
    }
}

@Preview
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExchangeRateScreen(viewModel: ExchangeRateViewModel = viewModel()) {
  Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceAround
    ) {

      Text(
          text = "Conversor de Divisas",
          style = MaterialTheme.typography.headlineMedium
      )


          OutlinedTextField(
              value = viewModel.amount,
              onValueChange = { viewModel.updateAmount(it) },
              label = { Text("Cantidad") },
              singleLine = true
          )

          Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
              var fromExpanded by remember { mutableStateOf(false) }
              var toExpanded by remember { mutableStateOf(false) }

              // ComboBox de Moneda de Origen
              ExposedDropdownMenuBox(
                  expanded = fromExpanded,
                  onExpandedChange = { fromExpanded = it },
                  modifier = Modifier.weight(1f)
              ) {
                  TextField(
                      value = viewModel.fromCurrency,
                      onValueChange = {},
                      readOnly = true,
                      trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = fromExpanded) },
                      modifier = Modifier
                          .clickable { fromExpanded = true } // ✅ Alternativa a menuAnchor()
                  )

                  DropdownMenu(
                      expanded = fromExpanded,
                      onDismissRequest = { fromExpanded = false }
                  ) {
                      ExchangeRateViewModel.availableCurrencies.forEach { currency ->
                          DropdownMenuItem(
                              text = { Text(currency) },
                              onClick = {
                                  viewModel.updateFromCurrency(currency)
                                  fromExpanded = false // Cierra el menú después de seleccionar
                              }
                          )
                      }
                  }
              }

              // ComboBox de Moneda de Destino
              ExposedDropdownMenuBox(
                  expanded = toExpanded,
                  onExpandedChange = { toExpanded = it },
                  modifier = Modifier.weight(1f)
              ) {
                  TextField(
                      value = viewModel.toCurrency,
                      onValueChange = {},
                      readOnly = true,
                      trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = toExpanded) },
                      modifier = Modifier
                          .clickable { toExpanded = true } // ✅ Alternativa a menuAnchor()
                  )

                  DropdownMenu(
                      expanded = toExpanded,
                      onDismissRequest = { toExpanded = false }
                  ) {
                      ExchangeRateViewModel.availableCurrencies.forEach { currency ->
                          DropdownMenuItem(
                              text = { Text(currency) },
                              onClick = {
                                  viewModel.updateToCurrency(currency)
                                  toExpanded = false // Cierra el menú después de seleccionar
                              }
                          )
                      }
                  }
              }
          }




          if (viewModel.isLoading) {
              CircularProgressIndicator()
          } else {
              Text(
                  text = "Resultado: ${viewModel.result} ${viewModel.toCurrency}",
                  style = MaterialTheme.typography.headlineSmall
              )
          }

          Row (modifier = Modifier.fillMaxWidth(),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement =Arrangement.Center) {
              Text(
                  text = "Desarrollada por Simón Cortés Lotero",
                  style = MaterialTheme.typography.titleMedium,)
          }


          viewModel.error?.let { error ->
              Text(
                  text = error,
                  color = MaterialTheme.colorScheme.error,
                  style = MaterialTheme.typography.bodyMedium
              )
          }

  }


}

