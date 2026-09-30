package com.example.proyectoespecial;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class DashboardActivity extends AppCompatActivity {

    private TextView tvActivos;
    private TextView tvSaldo;
    private Button btnIrCrearEnvio;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        tvActivos = findViewById(R.id.tvActivos);
        tvSaldo = findViewById(R.id.tvSaldo);
        btnIrCrearEnvio = findViewById(R.id.btnIrCrearEnvio);

        btnIrCrearEnvio.setOnClickListener(v -> {
            Intent intent = new Intent(DashboardActivity.this, CreateShipmentActivity.class);
            startActivity(intent);
        });
    }
}
