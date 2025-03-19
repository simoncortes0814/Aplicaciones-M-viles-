package com.example.changedivisas.data

import retrofit2.http.GET
import retrofit2.http.Path

interface ExchangeRateApi {
    @GET("pair/{from}/{to}")
    suspend fun getExchangeRate(
        @Path("from") fromCurrency: String,
        @Path("to") toCurrency: String
    ): ExchangeRateResponse
}

data class ExchangeRateResponse(
    val result: String,
    val documentation: String,
    val terms_of_use: String,
    val time_last_update_unix: Long,
    val time_last_update_utc: String,
    val time_next_update_unix: Long,
    val time_next_update_utc: String,
    val base_code: String,
    val target_code: String,
    val conversion_rate: Double
) 