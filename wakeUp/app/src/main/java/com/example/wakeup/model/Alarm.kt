package com.example.wakeup.model

import java.util.*

data class Alarm(
    val id: Long = System.currentTimeMillis(),
    val time: Date,
    val isEnabled: Boolean = true,
    val temperature: Double? = null,
    val description: String = ""
) 