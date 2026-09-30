package com.example.proyectoespecial;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Random;

public class CreateShipmentActivity extends AppCompatActivity {

    private EditText etTamano;
    private EditText etPeso;
    private EditText etCelularComprador;
    private Button btnCrearEnvio;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_shipment);

        etTamano = findViewById(R.id.etTamano);
        etPeso = findViewById(R.id.etPeso);
        etCelularComprador = findViewById(R.id.etCelularComprador);
        btnCrearEnvio = findViewById(R.id.btnCrearEnvio);

        btnCrearEnvio.setOnClickListener(v -> {
            String tamano = etTamano.getText().toString();
            String peso = etPeso.getText().toString();
            String celular = etCelularComprador.getText().toString();

            if (tamano.isEmpty() || peso.isEmpty() || celular.isEmpty()) {
                Toast.makeText(CreateShipmentActivity.this, "Por favor completa todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }

            Random random = new Random();
            int idAleatorio = random.nextInt(9000) + 1000;
            Toast.makeText(CreateShipmentActivity.this, "¡Envío creado con éxito! PIN: CBX-" + idAleatorio, Toast.LENGTH_LONG).show();
            finish();
        });
    }
}
