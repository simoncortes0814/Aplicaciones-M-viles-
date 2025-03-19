package com.example.wakeup.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wakeup.api.WeatherService
import com.example.wakeup.model.Alarm
import com.example.wakeup.service.NotificationService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.*


class AlarmViewModel(application: Application) : AndroidViewModel(application) {
    companion object {
        private const val WEATHER_API_KEY = "f7debd8a1c9401dc75a10900947b8842"
        private const val DEFAULT_CITY = "Medellin,CO"
        private const val MILLIS_IN_MINUTE = 60 * 1000L
    }

    private val _alarms = MutableStateFlow<List<Alarm>>(emptyList())
    val alarms: StateFlow<List<Alarm>> = _alarms

    private val notificationService = NotificationService(application)
    private val weatherService = Retrofit.Builder()
        .baseUrl("https://api.openweathermap.org/data/2.5/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(WeatherService::class.java)

    fun addAlarm(selectedCalendar: Calendar) {
        val now = Calendar.getInstance()
        val alarmCalendar = Calendar.getInstance()

        // Configurar la fecha de la alarma con la fecha actual
        alarmCalendar.apply {
            set(Calendar.YEAR, now.get(Calendar.YEAR))
            set(Calendar.MONTH, now.get(Calendar.MONTH))
            set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH))
            set(Calendar.HOUR_OF_DAY, selectedCalendar.get(Calendar.HOUR_OF_DAY))
            set(Calendar.MINUTE, selectedCalendar.get(Calendar.MINUTE))
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }

        // Comparar si la hora seleccionada es anterior a la actual
        val selectedTimeInMinutes = alarmCalendar.get(Calendar.HOUR_OF_DAY) * 60 + alarmCalendar.get(Calendar.MINUTE)
        val currentTimeInMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)

        // Si la hora seleccionada es anterior o igual a la actual, programar para mañana
        if (selectedTimeInMinutes <= currentTimeInMinutes) {
            alarmCalendar.add(Calendar.DAY_OF_MONTH, 1)
        }

        val newAlarm = Alarm(time = alarmCalendar.time)
        _alarms.value = _alarms.value + newAlarm
        updateWeatherForAlarm(newAlarm)
        scheduleAlarm(newAlarm)
    }

    private fun updateWeatherForAlarm(alarm: Alarm) {
        viewModelScope.launch {
            try {
                val response = weatherService.getWeather(
                    city = DEFAULT_CITY,
                    apiKey = WEATHER_API_KEY
                )
                val updatedAlarm = alarm.copy(
                    temperature = response.main.temp,
                    description = "${response.weather.firstOrNull()?.description ?: ""} - ${response.main.temp}°C"
                )
                _alarms.value = _alarms.value.map { 
                    if (it.id == alarm.id) updatedAlarm else it 
                }
            } catch (e: Exception) {
                // Manejar el error
            }
        }
    }

    private fun scheduleAlarm(alarm: Alarm) {
        viewModelScope.launch {
            val now = Calendar.getInstance()
            val alarmTime = Calendar.getInstance().apply { 
                time = alarm.time
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            
            val timeUntilMillis = alarmTime.timeInMillis - now.timeInMillis
            val timeUntilMinutes = timeUntilMillis / MILLIS_IN_MINUTE
            
            if (timeUntilMinutes > 0) {
                notificationService.showTimeUntilAlarmNotification(
                    alarm,
                    formatTimeUntil(timeUntilMinutes)
                )
            }
        }
    }

    fun getTimeUntilAlarm(alarm: Alarm): String {
        val now = Calendar.getInstance()
        val alarmTime = Calendar.getInstance().apply { 
            time = alarm.time
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        
        val timeUntilMillis = alarmTime.timeInMillis - now.timeInMillis
        val timeUntilMinutes = timeUntilMillis / MILLIS_IN_MINUTE
        
        return formatTimeUntil(timeUntilMinutes)
    }

    private fun formatTimeUntil(timeUntilMinutes: Long): String {
        return when {
            timeUntilMinutes <= 0 -> "La alarma ya pasó"
            timeUntilMinutes < 60 -> "Faltan $timeUntilMinutes minutos"
            else -> {
                val hours = timeUntilMinutes / 60
                val minutes = timeUntilMinutes % 60
                if (minutes > 0) {
                    "Faltan $hours horas y $minutes minutos"
                } else {
                    "Faltan $hours horas"
                }
            }
        }
    }

    fun toggleAlarm(alarm: Alarm) {
        _alarms.value = _alarms.value.map { 
            if (it.id == alarm.id) it.copy(isEnabled = !it.isEnabled) else it 
        }
    }

    fun deleteAlarm(alarm: Alarm) {
        _alarms.value = _alarms.value.filter { it.id != alarm.id }
    }
} 