package com.example.backend.soap.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

import com.example.backend.soap.dto.AddUserRequest;
import com.example.backend.soap.dto.AddUserResponse;
import com.example.backend.soap.dto.AuthenticateRequest;
import com.example.backend.soap.dto.AuthenticateResponse;
import com.example.backend.soap.dto.DeleteUserRequest;
import com.example.backend.soap.dto.DeleteUserResponse;
import com.example.backend.soap.dto.ListUsersRequest;
import com.example.backend.soap.dto.ListUsersResponse;
import com.example.backend.soap.dto.UpdateUserRequest;
import com.example.backend.soap.dto.UpdateUserResponse;
import com.example.backend.soap.dto.UserType;

@EnableWs
@Configuration
public class WebServiceConfig {

    private static final String NAMESPACE_URI = "http://backend.example.com/soap/users";

    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(ApplicationContext applicationContext) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean<>(servlet, "/ws/*");
    }

    @Bean(name = "users")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema usersSchema) {
        DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition();
        wsdl11Definition.setPortTypeName("UsersPort");
        wsdl11Definition.setLocationUri("/ws");
        wsdl11Definition.setTargetNamespace(NAMESPACE_URI);
        wsdl11Definition.setSchema(usersSchema);
        return wsdl11Definition;
    }

    @Bean
    public XsdSchema usersSchema() {
        return new SimpleXsdSchema(new ClassPathResource("xsd/users.xsd"));
    }

    @Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setClassesToBeBound(
                AuthenticateRequest.class,
                AuthenticateResponse.class,
                ListUsersRequest.class,
                ListUsersResponse.class,
                AddUserRequest.class,
                AddUserResponse.class,
                UpdateUserRequest.class,
                UpdateUserResponse.class,
                DeleteUserRequest.class,
                DeleteUserResponse.class,
                UserType.class);
        return marshaller;
    }
}
