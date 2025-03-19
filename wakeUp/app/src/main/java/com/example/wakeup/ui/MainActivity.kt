    package com.example.wakeup.ui
    
    import android.Manifest
    import android.os.Build
    import android.os.Bundle
    import androidx.activity.ComponentActivity
    import androidx.activity.compose.setContent
    import androidx.activity.result.contract.ActivityResultContracts
    import androidx.compose.foundation.layout.*
    import androidx.compose.foundation.lazy.LazyColumn
    import androidx.compose.foundation.lazy.items
    import androidx.compose.foundation.text.KeyboardOptions
    import androidx.compose.material.icons.Icons
    import androidx.compose.material.icons.filled.Add
    import androidx.compose.material.icons.filled.Delete
    import androidx.compose.material3.*
    import androidx.compose.runtime.*
    import androidx.compose.ui.Alignment
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.text.input.KeyboardType
    import androidx.compose.ui.unit.dp
    import androidx.lifecycle.viewmodel.compose.viewModel
    import com.example.wakeup.model.Alarm
    import com.example.wakeup.viewmodel.AlarmViewModel
    import java.text.SimpleDateFormat
    import java.util.*

class MainActivity : ComponentActivity() {
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            // Permiso concedido
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }

        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AlarmScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlarmScreen(viewModel: AlarmViewModel = viewModel()) {
    var showTimePicker by remember { mutableStateOf(false) }
    var selectedHour by remember { mutableStateOf(12) }
    var selectedMinute by remember { mutableStateOf(0) }
    var isPM by remember { mutableStateOf(false) }
    
    val alarms by viewModel.alarms.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showTimePicker = true }
            ) {
                Icon(Icons.Default.Add, contentDescription = "Añadir alarma")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Mis Alarmas",
                style = MaterialTheme.typography.headlineMedium,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(alarms) { alarm ->
                    AlarmItem(
                        alarm = alarm,
                        viewModel = viewModel
                    )
                }
            }
        }

        if (showTimePicker) {
            AlertDialog(
                onDismissRequest = { showTimePicker = false },
                title = { Text("Seleccionar hora") },
                text = {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 8.dp)
                        ) {
                            NumberInput(
                                value = selectedHour,
                                onValueChange = { newValue ->
                                    if (newValue in 1..12) {
                                        selectedHour = newValue
                                    }
                                },
                                modifier = Modifier.width(60.dp)
                            )
                            Text(":", modifier = Modifier.padding(horizontal = 8.dp))
                            NumberInput(
                                value = selectedMinute,
                                onValueChange = { newValue ->
                                    if (newValue in 0..59) {
                                        selectedMinute = newValue
                                    }
                                },
                                modifier = Modifier.width(60.dp)
                            )
                        }
                        
                        Row(
                            modifier = Modifier.padding(top = 16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                RadioButton(
                                    selected = !isPM,
                                    onClick = { isPM = false }
                                )
                                Text("AM", modifier = Modifier.padding(start = 4.dp))
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                RadioButton(
                                    selected = isPM,
                                    onClick = { isPM = true }
                                )
                                Text("PM", modifier = Modifier.padding(start = 4.dp))
                            }
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val calendar = Calendar.getInstance().apply {
                                set(Calendar.HOUR_OF_DAY, when {
                                    isPM && selectedHour != 12 -> selectedHour + 12
                                    !isPM && selectedHour == 12 -> 0
                                    else -> selectedHour
                                })
                                set(Calendar.MINUTE, selectedMinute)
                                set(Calendar.SECOND, 0)
                                set(Calendar.MILLISECOND, 0)
                            }
                            viewModel.addAlarm(calendar)
                            showTimePicker = false
                        }
                    ) {
                        Text("Aceptar")
                    }
                },
                dismissButton = {
                    TextButton(
                        onClick = { showTimePicker = false }
                    ) {
                        Text("Cancelar")
                    }
                }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NumberInput(
    value: Int,
    onValueChange: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var text by remember(value) { mutableStateOf(value.toString().padStart(2, '0')) }
    
    OutlinedTextField(
        value = text,
        onValueChange = { newText ->
            if (newText.isEmpty()) {
                text = "00"
                onValueChange(0)
            } else {
                val newValue = newText.toIntOrNull()
                if (newValue != null) {
                    text = newValue.toString().padStart(2, '0')
                    onValueChange(newValue)
                }
            }
        },
        modifier = modifier,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
        singleLine = true,
        textStyle = MaterialTheme.typography.headlineMedium
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlarmItem(alarm: Alarm, viewModel: AlarmViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = { viewModel.toggleAlarm(alarm) }
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(alarm.time),
                    style = MaterialTheme.typography.headlineMedium
                )
                Text(
                    text = viewModel.getTimeUntilAlarm(alarm),
                    style = MaterialTheme.typography.bodyMedium
                )
                if (alarm.description.isNotEmpty()) {
                    Text(
                        text = alarm.description,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                alarm.temperature?.let { temp ->
                    Text(
                        text = String.format("%.1f°C", temp),
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
            
            Row {
                Switch(
                    checked = alarm.isEnabled,
                    onCheckedChange = { viewModel.toggleAlarm(alarm) }
                )
                IconButton(onClick = { viewModel.deleteAlarm(alarm) }) {
                    Icon(Icons.Default.Delete, contentDescription = "Eliminar")
                }
            }
        }
    }
} 