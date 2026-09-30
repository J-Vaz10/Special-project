package com.example.proyectoespecial;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class KycActivity extends AppCompatActivity {

    private Button btnTomarIne;
    private Button btnTomarSelfie;
    private EditText etRfc;
    private Button btnValidarIdentidad;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_kyc);

        btnTomarIne = findViewById(R.id.btnTomarIne);
        btnTomarSelfie = findViewById(R.id.btnTomarSelfie);
        etRfc = findViewById(R.id.etRfc);
        btnValidarIdentidad = findViewById(R.id.btnValidarIdentidad);

        btnTomarIne.setOnClickListener(v -> {
            Toast.makeText(KycActivity.this, "Abriendo cámara para capturar INE...", Toast.LENGTH_SHORT).show();
        });

        btnTomarSelfie.setOnClickListener(v -> {
            Toast.makeText(KycActivity.this, "Abriendo cámara frontal para Selfie...", Toast.LENGTH_SHORT).show();
        });

        btnValidarIdentidad.setOnClickListener(v -> {
            String rfc = etRfc.getText().toString().trim();
            if (rfc.isEmpty()) {
                Toast.makeText(KycActivity.this, "Por favor ingresa tu RFC o CURP", Toast.LENGTH_SHORT).show();
                return;
            }

            Toast.makeText(KycActivity.this, "Identidad verificada con éxito", Toast.LENGTH_SHORT).show();

            // Navegar a la pantalla de registro de negocio
            Intent intent = new Intent(KycActivity.this, RegisterBusinessActivity.class);
            startActivity(intent);
        });
    }
}
