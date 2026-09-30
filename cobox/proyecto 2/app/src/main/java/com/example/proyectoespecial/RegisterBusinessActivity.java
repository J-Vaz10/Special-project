package com.example.proyectoespecial;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class RegisterBusinessActivity extends AppCompatActivity {

    private EditText etNombreNegocio;
    private EditText etDireccion;
    private EditText etHorario;
    private EditText etTelefono;
    private CheckBox cbPudo;
    private Button btnRegistrar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_business);

        etNombreNegocio = findViewById(R.id.etNombreNegocio);
        etDireccion = findViewById(R.id.etDireccion);
        etHorario = findViewById(R.id.etHorario);
        etTelefono = findViewById(R.id.etTelefono);
        cbPudo = findViewById(R.id.cbPudo);
        btnRegistrar = findViewById(R.id.btnRegistrar);

        btnRegistrar.setOnClickListener(v -> {
            String nombre = etNombreNegocio.getText().toString().trim();
            String direccion = etDireccion.getText().toString().trim();

            if (nombre.isEmpty() || direccion.isEmpty()) {
                Toast.makeText(RegisterBusinessActivity.this, "Llena al menos el nombre y la dirección", Toast.LENGTH_SHORT).show();
                return;
            }

            boolean esPudo = cbPudo.isChecked();
            Toast.makeText(RegisterBusinessActivity.this, "Negocio registrado con éxito. ¿Es PUDO?: " + esPudo, Toast.LENGTH_LONG).show();

            // Avanzar al Dashboard principal
            Intent intent = new Intent(RegisterBusinessActivity.this, DashboardActivity.class);
            startActivity(intent);
        });
    }
}
