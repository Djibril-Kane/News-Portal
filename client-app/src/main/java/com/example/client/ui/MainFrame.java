package com.example.client.ui;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.table.DefaultTableModel;

import com.example.client.SoapClient;
import com.example.client.SoapClient.SoapFaultException;
import com.example.client.model.RemoteUser;

// Fenetre principale : tableau des utilisateurs + CRUD complet via le service SOAP.
// Les formulaires d'ajout/modification utilisent de simples JOptionPane plutot que des
// ecrans dedies, pour rester une interface volontairement minimale.
public class MainFrame extends JFrame {

    private static final String[] ROLES = { "EDITEURS", "ADMINS" };

    private final SoapClient client;
    private final String jeton;
    private final DefaultTableModel tableModel;
    private final JTable table;

    public MainFrame(SoapClient client, String jeton) {
        super("News Portal - Gestion des utilisateurs");
        this.client = client;
        this.jeton = jeton;

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(650, 400);
        setLocationRelativeTo(null);

        tableModel = new DefaultTableModel(new Object[] { "Id", "Nom", "Prenom", "Email", "Role" }, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        table = new JTable(tableModel);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        JButton refreshButton = new JButton("Rafraichir");
        JButton addButton = new JButton("Ajouter");
        JButton editButton = new JButton("Modifier");
        JButton deleteButton = new JButton("Supprimer");

        refreshButton.addActionListener(e -> refresh());
        addButton.addActionListener(e -> addUser());
        editButton.addActionListener(e -> editUser());
        deleteButton.addActionListener(e -> deleteUser());

        JPanel buttons = new JPanel();
        buttons.add(refreshButton);
        buttons.add(addButton);
        buttons.add(editButton);
        buttons.add(deleteButton);

        setLayout(new BorderLayout());
        add(new JScrollPane(table), BorderLayout.CENTER);
        add(buttons, BorderLayout.SOUTH);

        refresh();
    }

    private void refresh() {
        try {
            List<RemoteUser> users = client.listUsers(jeton);
            tableModel.setRowCount(0);
            for (RemoteUser u : users) {
                tableModel.addRow(new Object[] { u.id(), u.nom(), u.prenom(), u.email(), u.role() });
            }
        } catch (SoapFaultException e) {
            showError("Erreur du serveur : " + e.getMessage());
        } catch (Exception e) {
            showError("Erreur reseau : " + e.getMessage());
        }
    }

    private void addUser() {
        JTextField nomField = new JTextField();
        JTextField prenomField = new JTextField();
        JTextField emailField = new JTextField();
        JPasswordField passwordField = new JPasswordField();
        JComboBox<String> roleBox = new JComboBox<>(ROLES);

        JPanel panel = buildForm(
                new String[] { "Nom", "Prenom", "Email", "Mot de passe", "Role" },
                new JComponent[] { nomField, prenomField, emailField, passwordField, roleBox });

        int result = JOptionPane.showConfirmDialog(this, panel, "Ajouter un utilisateur",
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result != JOptionPane.OK_OPTION) return;

        try {
            client.addUser(jeton, nomField.getText().trim(), prenomField.getText().trim(),
                    emailField.getText().trim(), new String(passwordField.getPassword()),
                    (String) roleBox.getSelectedItem());
            refresh();
        } catch (SoapFaultException e) {
            showError("Erreur du serveur : " + e.getMessage());
        } catch (Exception e) {
            showError("Erreur reseau : " + e.getMessage());
        }
    }

    private void editUser() {
        int row = table.getSelectedRow();
        if (row == -1) {
            showError("Selectionnez un utilisateur dans la liste d'abord.");
            return;
        }

        Long id = (Long) tableModel.getValueAt(row, 0);
        JTextField nomField = new JTextField((String) tableModel.getValueAt(row, 1));
        JTextField prenomField = new JTextField((String) tableModel.getValueAt(row, 2));
        JTextField emailField = new JTextField((String) tableModel.getValueAt(row, 3));
        JComboBox<String> roleBox = new JComboBox<>(ROLES);
        roleBox.setSelectedItem(tableModel.getValueAt(row, 4));

        JPanel panel = buildForm(
                new String[] { "Nom", "Prenom", "Email", "Role" },
                new JComponent[] { nomField, prenomField, emailField, roleBox });

        int result = JOptionPane.showConfirmDialog(this, panel, "Modifier l'utilisateur #" + id,
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result != JOptionPane.OK_OPTION) return;

        try {
            client.updateUser(jeton, id, nomField.getText().trim(), prenomField.getText().trim(),
                    emailField.getText().trim(), (String) roleBox.getSelectedItem());
            refresh();
        } catch (SoapFaultException e) {
            showError("Erreur du serveur : " + e.getMessage());
        } catch (Exception e) {
            showError("Erreur reseau : " + e.getMessage());
        }
    }

    private void deleteUser() {
        int row = table.getSelectedRow();
        if (row == -1) {
            showError("Selectionnez un utilisateur dans la liste d'abord.");
            return;
        }

        Long id = (Long) tableModel.getValueAt(row, 0);
        int confirm = JOptionPane.showConfirmDialog(this,
                "Supprimer l'utilisateur #" + id + " ?", "Confirmation", JOptionPane.YES_NO_OPTION);
        if (confirm != JOptionPane.YES_OPTION) return;

        try {
            client.deleteUser(jeton, id);
            refresh();
        } catch (SoapFaultException e) {
            showError("Erreur du serveur : " + e.getMessage());
        } catch (Exception e) {
            showError("Erreur reseau : " + e.getMessage());
        }
    }

    private JPanel buildForm(String[] labels, JComponent[] fields) {
        JPanel panel = new JPanel(new GridLayout(labels.length, 2, 5, 5));
        for (int i = 0; i < labels.length; i++) {
            panel.add(new JLabel(labels[i] + " :"));
            panel.add(fields[i]);
        }
        return panel;
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Erreur", JOptionPane.ERROR_MESSAGE);
    }
}
