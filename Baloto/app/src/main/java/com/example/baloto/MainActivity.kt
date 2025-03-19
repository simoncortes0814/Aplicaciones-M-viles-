package com.example.baloto
import android.content.pm.ActivityInfo
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.baloto.ui.theme.BalotoTheme
import kotlinx.coroutines.delay

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BalotoTheme {
                DiceRollerApp()
            }
        }
    }
}

@Preview
@Composable
fun DiceRollerApp() {
    DiceWithButtonAndImage(modifier = Modifier
        .fillMaxSize()
        .wrapContentSize(Alignment.Center))
}

@Composable
fun DiceWithButtonAndImage(modifier: Modifier = Modifier) {
    val numeros = remember { mutableStateOf(List(4) { (0..9).random() }) }
    val serie = remember { mutableStateOf(List(3) { (0..9).random() }) }
    val winner = remember { mutableStateOf("") }

    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Números", style = MaterialTheme.typography.headlineSmall)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                numeros.value.forEach { num ->
                    Image(
                        painter = painterResource(id = getNumberDrawable(num)),
                        contentDescription = num.toString(),
                        modifier = Modifier.size(64.dp).padding(4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Text(text = "Serie", style = MaterialTheme.typography.headlineSmall)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                serie.value.forEach { num ->
                    Image(
                        painter = painterResource(id = getNumberDrawable(num)),
                        contentDescription = num.toString(),
                        modifier = Modifier.size(64.dp).padding(4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    numeros.value = List(4) { (0..9).random() }
                    serie.value = List(3) { (0..9).random() }
                    winner.value = "El número ganador es el ${numeros.value} de la serie ${serie.value}"
                },
                modifier = Modifier.padding(16.dp)
            ) {
                Text(text = "Jugar Baloto")
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (winner.value.isNotEmpty()) {
                Text(text = winner.value, style = MaterialTheme.typography.headlineSmall)

                LaunchedEffect(winner.value) {
                    delay(10000) // 10 segundos
                    winner.value = "" // Borrar mensaje
                }
            }
        }
    }
}


fun getNumberDrawable(number: Int): Int {
    return when (number) {
        0 -> R.drawable.number_zero
        1 -> R.drawable.number_one_svgrepo_com
        2 -> R.drawable.number_two_svgrepo_com
        3 -> R.drawable.number_three_svgrepo_com
        4 -> R.drawable.number_four_svgrepo_com
        5 -> R.drawable.number_five_svgrepo_com
        6 -> R.drawable.number_six_svgrepo_com
        7 -> R.drawable.number_seven_svgrepo_com
        8 -> R.drawable.number_eight_svgrepo_com
        9 -> R.drawable.number_nine_svgrepo_com
        else -> R.drawable.number_zero // En caso de error
    }
}
