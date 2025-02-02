package example.market.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddUserRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private String role;
}
