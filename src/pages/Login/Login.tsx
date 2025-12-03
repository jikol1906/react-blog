import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Field, 
  FieldLabel, 
  FieldGroup, 
  FieldError 
} from "@/components/ui/field"; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Use the values from our new AuthManager
    const { login, isLoading, error: authError } = useAuth();
    
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setFormError(null);

        // Basic validation
        if (!email || !password) {
            setFormError("Please fill in all fields.");
            return;
        }

        // Call the login function from context
        const success = await login(email, password);

        if (success) {
            // Redirect to home upon success
            navigate("/");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                {/* Display errors from local validation OR the AuthContext */}
                                {(formError || authError) && (
                                    <FieldError>{formError || authError}</FieldError>
                                )}
                            </Field>

                            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-gray-500 text-center w-full">
                        Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;