package restaurant_management.user.service;

public interface AuthService {
    void registerUser(String email,String password,String roleName,String userName);
}
