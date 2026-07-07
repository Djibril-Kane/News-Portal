package com.example.client;

import java.io.IOException;
import java.util.List;
import java.util.Scanner;

import com.example.client.SoapClient.AuthResult;
import com.example.client.SoapClient.SoapFaultException;
import com.example.client.model.RemoteUser;

// Application cliente Java (Lot 3.6) : demande login/mot de passe, appelle le service
// SOAP authenticate, et si l'utilisateur est administrateur donne acces au CRUD complet
// des utilisateurs via SOAP (sinon acces refuse).
public class Main {

    private static final String SOAP_ENDPOINT = "http://localhost:8080/ws";

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        SoapClient client = new SoapClient(SOAP_ENDPOINT);

        System.out.println("=== Client News Portal - Gestion des utilisateurs ===");
        System.out.print("Email : ");
        String email = scanner.nextLine().trim();
        System.out.print("Mot de passe : ");
        String password = scanner.nextLine().trim();

        AuthResult auth;
        try {
            auth = client.authenticate(email, password);
        } catch (IOException | InterruptedException e) {
            System.out.println("Impossible de contacter le service SOAP sur " + SOAP_ENDPOINT
                    + ". Le backend est-il demarre ? (" + e.getMessage() + ")");
            return;
        }

        if (!auth.success()) {
            System.out.println("Identifiants incorrects. Acces refuse.");
            return;
        }

        if (!"ADMINS".equals(auth.role())) {
            System.out.println("Connexion reussie (role " + auth.role()
                    + "), mais seul un administrateur peut gerer les utilisateurs. Acces refuse.");
            return;
        }

        System.out.println("Bienvenue, administrateur.");
        System.out.print("Jeton de service (genere depuis l'espace admin du site, page Jetons d'authentification) : ");
        String jeton = scanner.nextLine().trim();

        boolean running = true;
        while (running) {
            printMenu();
            String choice = scanner.nextLine().trim();
            try {
                switch (choice) {
                    case "1" -> listUsers(client, jeton);
                    case "2" -> addUser(client, scanner, jeton);
                    case "3" -> updateUser(client, scanner, jeton);
                    case "4" -> deleteUser(client, scanner, jeton);
                    case "5" -> running = false;
                    default -> System.out.println("Choix invalide.");
                }
            } catch (SoapFaultException e) {
                System.out.println("Erreur du serveur : " + e.getMessage());
            } catch (IOException | InterruptedException e) {
                System.out.println("Erreur reseau : " + e.getMessage());
            } catch (NumberFormatException e) {
                System.out.println("Identifiant invalide, veuillez saisir un nombre.");
            }
        }

        System.out.println("Au revoir.");
    }

    private static void printMenu() {
        System.out.println();
        System.out.println("1. Lister les utilisateurs");
        System.out.println("2. Ajouter un utilisateur");
        System.out.println("3. Modifier un utilisateur");
        System.out.println("4. Supprimer un utilisateur");
        System.out.println("5. Quitter");
        System.out.print("Choix : ");
    }

    private static void listUsers(SoapClient client, String jeton) throws IOException, InterruptedException {
        List<RemoteUser> users = client.listUsers(jeton);
        if (users.isEmpty()) {
            System.out.println("Aucun utilisateur.");
            return;
        }
        for (RemoteUser u : users) {
            System.out.printf("#%d - %s %s <%s> [%s]%n", u.id(), u.prenom(), u.nom(), u.email(), u.role());
        }
    }

    private static void addUser(SoapClient client, Scanner scanner, String jeton) throws IOException, InterruptedException {
        System.out.print("Nom : ");
        String nom = scanner.nextLine().trim();
        System.out.print("Prenom : ");
        String prenom = scanner.nextLine().trim();
        System.out.print("Email : ");
        String email = scanner.nextLine().trim();
        System.out.print("Mot de passe : ");
        String password = scanner.nextLine().trim();
        String role = readRole(scanner);

        RemoteUser created = client.addUser(jeton, nom, prenom, email, password, role);
        System.out.println("Utilisateur cree : #" + created.id() + " " + created.prenom() + " " + created.nom());
    }

    private static void updateUser(SoapClient client, Scanner scanner, String jeton) throws IOException, InterruptedException {
        System.out.print("Id de l'utilisateur a modifier : ");
        long id = Long.parseLong(scanner.nextLine().trim());
        System.out.print("Nouveau nom : ");
        String nom = scanner.nextLine().trim();
        System.out.print("Nouveau prenom : ");
        String prenom = scanner.nextLine().trim();
        System.out.print("Nouvel email : ");
        String email = scanner.nextLine().trim();
        String role = readRole(scanner);

        RemoteUser updated = client.updateUser(jeton, id, nom, prenom, email, role);
        System.out.println("Utilisateur modifie : #" + updated.id() + " " + updated.prenom() + " " + updated.nom());
    }

    private static void deleteUser(SoapClient client, Scanner scanner, String jeton) throws IOException, InterruptedException {
        System.out.print("Id de l'utilisateur a supprimer : ");
        long id = Long.parseLong(scanner.nextLine().trim());
        boolean success = client.deleteUser(jeton, id);
        System.out.println(success ? "Utilisateur supprime." : "Echec de la suppression.");
    }

    private static String readRole(Scanner scanner) {
        while (true) {
            System.out.print("Role (EDITEURS/ADMINS) : ");
            String role = scanner.nextLine().trim().toUpperCase();
            if (role.equals("EDITEURS") || role.equals("ADMINS")) {
                return role;
            }
            System.out.println("Role invalide, tapez EDITEURS ou ADMINS.");
        }
    }
}
