package example.market.service;

import example.market.request.AuthenticationRequest;
import example.market.request.RegisterRequest;

public interface AuthenticationService {
    String register(RegisterRequest request);

    String authenticate(AuthenticationRequest request);

}
