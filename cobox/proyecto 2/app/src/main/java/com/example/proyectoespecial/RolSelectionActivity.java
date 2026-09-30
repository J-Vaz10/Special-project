package com.example.proyectoespecial;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class RolSelectionActivity extends AppCompatActivity {

    private RadioGroup rgRoles;
    private CheckBox cbPrivacidad;
    private Button btnContinuar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rol_selection);

        rgRoles = findViewById(R.id.rgRoles);
        cbPrivacidad = findViewById(R.id.cbPrivacidad);
        btnContinuar = findViewById(R.id.btnContinuar);

        btnContinuar.setOnClickListener(v -> {
            int selectedId = rgRoles.getCheckedRadioButtonId();

            if (selectedId == -1) {
                Toast.makeText(RolSelectionActivity.this, "Por favor selecciona un rol para continuar", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!cbPrivacidad.isChecked()) {
                Toast.makeText(RolSelectionActivity.this, "Debes aceptar el Aviso de Privacidad y Términos", Toast.LENGTH_SHORT).show();
                return;
            }

            RadioButton rbSelected = findViewById(selectedId);
            String rolElegido = rbSelected.getText().toString();

            Toast.makeText(RolSelectionActivity.this, "Rol seleccionado: " + rolElegido, Toast.LENGTH_SHORT).show();

            // Navegar a la pantalla de verificación de identidad (KycActivity)
            Intent intent = new Intent(RolSelectionActivity.this, KycActivity.class);
            intent.putExtra("ROL_SELECCIONADO", rolElegido);
            startActivity(intent);
        });
    }
}
