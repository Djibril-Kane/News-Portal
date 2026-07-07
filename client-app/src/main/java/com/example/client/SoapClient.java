package com.example.client;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.example.client.model.RemoteUser;

// Client SOAP ecrit a la main (enveloppes construites en texte, reponses parsees en DOM) :
// pas de generation JAXB depuis le WSDL (wsimport n'est plus fourni avec le JDK depuis Java 11),
// ce qui evite d'ajouter un plugin de build supplementaire pour un contrat aussi simple.
public class SoapClient {

    private static final String NAMESPACE = "http://backend.example.com/soap/users";
    private static final String SOAP_NS = "http://schemas.xmlsoap.org/soap/envelope/";

    private final String endpoint;
    private final HttpClient httpClient;

    public SoapClient(String endpoint) {
        this.endpoint = endpoint;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    public record AuthResult(boolean success, String role) {
    }

    public static class SoapFaultException extends RuntimeException {
        public SoapFaultException(String message) {
            super(message);
        }
    }

    public AuthResult authenticate(String login, String password) throws IOException, InterruptedException {
        String body = """
                <authenticateRequest xmlns="%s">
                    <login>%s</login>
                    <password>%s</password>
                </authenticateRequest>
                """.formatted(NAMESPACE, escape(login), escape(password));

        Document doc = send(body);
        checkFault(doc);

        String status = textContent(doc, "status");
        String role = textContent(doc, "role");
        return new AuthResult("SUCCES".equals(status), role);
    }

    public List<RemoteUser> listUsers(String jeton) throws IOException, InterruptedException {
        String body = """
                <listUsersRequest xmlns="%s">
                    <jeton>%s</jeton>
                </listUsersRequest>
                """.formatted(NAMESPACE, escape(jeton));

        Document doc = send(body);
        checkFault(doc);

        List<RemoteUser> users = new ArrayList<>();
        NodeList nodes = doc.getElementsByTagNameNS(NAMESPACE, "user");
        for (int i = 0; i < nodes.getLength(); i++) {
            users.add(parseUser((Element) nodes.item(i)));
        }
        return users;
    }

    public RemoteUser addUser(String jeton, String nom, String prenom, String email, String password, String role)
            throws IOException, InterruptedException {
        String body = """
                <addUserRequest xmlns="%s">
                    <jeton>%s</jeton>
                    <nom>%s</nom>
                    <prenom>%s</prenom>
                    <email>%s</email>
                    <password>%s</password>
                    <role>%s</role>
                </addUserRequest>
                """.formatted(NAMESPACE, escape(jeton), escape(nom), escape(prenom), escape(email), escape(password), escape(role));

        Document doc = send(body);
        checkFault(doc);
        return parseUser((Element) doc.getElementsByTagNameNS(NAMESPACE, "user").item(0));
    }

    public RemoteUser updateUser(String jeton, long id, String nom, String prenom, String email, String role)
            throws IOException, InterruptedException {
        String body = """
                <updateUserRequest xmlns="%s">
                    <jeton>%s</jeton>
                    <id>%d</id>
                    <nom>%s</nom>
                    <prenom>%s</prenom>
                    <email>%s</email>
                    <role>%s</role>
                </updateUserRequest>
                """.formatted(NAMESPACE, escape(jeton), id, escape(nom), escape(prenom), escape(email), escape(role));

        Document doc = send(body);
        checkFault(doc);
        return parseUser((Element) doc.getElementsByTagNameNS(NAMESPACE, "user").item(0));
    }

    public boolean deleteUser(String jeton, long id) throws IOException, InterruptedException {
        String body = """
                <deleteUserRequest xmlns="%s">
                    <jeton>%s</jeton>
                    <id>%d</id>
                </deleteUserRequest>
                """.formatted(NAMESPACE, escape(jeton), id);

        Document doc = send(body);
        checkFault(doc);
        return "true".equals(textContent(doc, "success"));
    }

    private Document send(String bodyXml) throws IOException, InterruptedException {
        String envelope = """
                <?xml version="1.0" encoding="UTF-8"?>
                <soapenv:Envelope xmlns:soapenv="%s">
                    <soapenv:Body>
                        %s
                    </soapenv:Body>
                </soapenv:Envelope>
                """.formatted(SOAP_NS, bodyXml);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "text/xml; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(envelope, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            return factory.newDocumentBuilder()
                    .parse(new ByteArrayInputStream(response.body().getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IOException("Reponse SOAP illisible (HTTP " + response.statusCode() + ") : " + response.body(), e);
        }
    }

    private void checkFault(Document doc) {
        NodeList faults = doc.getElementsByTagNameNS(SOAP_NS, "Fault");
        if (faults.getLength() > 0) {
            String message = textContent(doc, "faultstring");
            throw new SoapFaultException(message != null ? message : "Erreur SOAP inconnue");
        }
    }

    private RemoteUser parseUser(Element userElement) {
        return new RemoteUser(
                Long.parseLong(childText(userElement, "id")),
                childText(userElement, "nom"),
                childText(userElement, "prenom"),
                childText(userElement, "email"),
                childText(userElement, "role"));
    }

    private String childText(Element parent, String localName) {
        NodeList nodes = parent.getElementsByTagNameNS(NAMESPACE, localName);
        return nodes.getLength() > 0 ? nodes.item(0).getTextContent() : null;
    }

    // les elements du contrat "users" (status, role, success...) sont dans NAMESPACE ;
    // faultstring/faultcode d'un SOAP Fault 1.1 ne sont qualifies par aucun namespace,
    // d'ou le repli sur "*" si la recherche qualifiee ne trouve rien
    private String textContent(Document doc, String localName) {
        NodeList nodes = doc.getElementsByTagNameNS(NAMESPACE, localName);
        if (nodes.getLength() == 0) {
            nodes = doc.getElementsByTagNameNS("*", localName);
        }
        return nodes.getLength() > 0 ? nodes.item(0).getTextContent() : null;
    }

    private static String escape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
