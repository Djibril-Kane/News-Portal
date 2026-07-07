package com.example.client.ui;

import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

import com.example.client.SoapClient;
import com.example.client.SoapClient.AuthResult;

// Ecran de connexion : login/mot de passe -> authenticate SOAP -> si ADMINS, demande
// le jeton de service puis ouvre la fenetre de gestion des utilisateurs.
public class LoginFrame extends JFrame {

    private static final String SOAP_ENDPOINT = "http://localhost:8080/ws";

    private final JTextField emailField = new JTextField(20);
    private final JPasswordField passwordField = new JPasswordField(20);
    private final JLabel statusLabel = new JLabel(" ");

    public LoginFrame() {
        super("News Portal - Connexion");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setResizable(false);

        JPanel form = new JPanel(new GridBagLayout());
        form.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(5, 5, 5, 5);
        c.fill = GridBagConstraints.HORIZONTAL;

        c.gridx = 0;
        c.gridy = 0;
        form.add(new JLabel("Email :"), c);
        c.gridx = 1;
        form.add(emailField, c);

        c.gridx = 0;
        c.gridy = 1;
        form.add(new JLabel("Mot de passe :"), c);
        c.gridx = 1;
        form.add(passwordField, c);

        JButton loginButton = new JButton("Se connecter");
        c.gridx = 0;
        c.gridy = 2;
        c.gridwidth = 2;
        form.add(loginButton, c);

        c.gridy = 3;
        statusLabel.setForeground(Color.RED);
        form.add(statusLabel, c);

        loginButton.addActionListener(e -> login());
        getRootPane().setDefaultButton(loginButton);

        setContentPane(form);
        pack();
        setLocationRelativeTo(null);
    }

    private void login() {
        String email = emailField.getText().trim();
        String password = new String(passwordField.getPassword());

        if (email.isEmpty() || password.isEmpty()) {
            statusLabel.setText("Email et mot de passe requis.");
            return;
        }

        SoapClient client = new SoapClient(SOAP_ENDPOINT);
        try {
            AuthResult auth = client.authenticate(email, password);

            if (!auth.success()) {
                statusLabel.setText("Identifiants incorrects.");
                return;
            }
            if (!"ADMINS".equals(auth.role())) {
                statusLabel.setText("Acces refuse : role " + auth.role() + ", reserve aux administrateurs.");
                return;
            }

            String jeton = JOptionPane.showInputDialog(this,
                    "Jeton de service (genere depuis l'espace admin du site, page Jetons d'authentification) :",
                    "Jeton requis", JOptionPane.QUESTION_MESSAGE);
            if (jeton == null || jeton.isBlank()) {
                statusLabel.setText("Un jeton est requis pour continuer.");
                return;
            }

            new MainFrame(client, jeton.trim()).setVisible(true);
            dispose();
        } catch (Exception e) {
            statusLabel.setText("Impossible de contacter le service SOAP (" + e.getMessage() + ").");
        }
    }
}
