package com.example.client;

import javax.swing.SwingUtilities;

import com.example.client.ui.LoginFrame;

// Application cliente Java (Lot 3.6) : interface graphique Swing. Ecran de connexion ->
// authenticate SOAP -> si administrateur, gestion complete des utilisateurs (sinon acces refuse).
public class Main {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new LoginFrame().setVisible(true));
    }
}
