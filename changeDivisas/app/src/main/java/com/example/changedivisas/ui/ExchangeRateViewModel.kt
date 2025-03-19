package com.example.changedivisas.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.changedivisas.data.ExchangeRateApi
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor

class ExchangeRateViewModel : ViewModel() {
    private val api: ExchangeRateApi

    var fromCurrency by mutableStateOf("USD")
        private set
    var toCurrency by mutableStateOf("COP")
        private set
    var amount by mutableStateOf("1.0")
        private set
    var result by mutableStateOf("0.0")
        private set
    var isLoading by mutableStateOf(false)
        private set
    var error by mutableStateOf<String?>(null)
        private set

    init {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .build()

        val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl("https://v6.exchangerate-api.com/v6/93f730a95b850d97d19b51e3/")
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi).asLenient())
            .build()

        api = retrofit.create(ExchangeRateApi::class.java)
    }

    fun updateFromCurrency(currency: String) {
        fromCurrency = currency
        convertCurrency()
    }

    fun updateToCurrency(currency: String) {
        toCurrency = currency
        convertCurrency()
    }

    fun updateAmount(newAmount: String) {
        amount = newAmount
        convertCurrency()
    }

    private fun convertCurrency() {
        val amountDouble = amount.toDoubleOrNull() ?: return
        
        viewModelScope.launch {
            try {
                isLoading = true
                error = null
                val response = api.getExchangeRate(fromCurrency, toCurrency)
                result = String.format("%.2f", amountDouble * response.conversion_rate)
            } catch (e: Exception) {
                error = e.message ?: "Error desconocido"
            } finally {
                isLoading = false
            }
        }
    }

    companion object {
        val availableCurrencies = listOf(
            "USD", "EUR", "COP", "MXN", "ARS", "BRL", "CLP", "PEN", "GBP", "JPY", "CNY"
        )
    }
} 