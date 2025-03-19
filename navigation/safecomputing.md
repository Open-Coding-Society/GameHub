---
layout: post
title: Safe Computing
description: Team Teach on Safe Computing
type: issues
permalink: /safecomputing
comments: true
---

## Big Idea 5: Safe Computing

### What is Safe Computing

- Safe Computing refers to practices and precautions taken to protect computers, networks, and data from threats such as viruses, malware, cyberattacks, and unauthorized access

# What is PII(Personally Identifiable Information)

- Information identifying a user on the Internet
- Safe computing revolves around this PII and how it is exploited or kept secure
- For example:- Social Security Number, email, full name, driver's license etc.
## Cookies

- A variety of different cookies are used in different sites
- These cookies track your PII, track your history on the site, and provide recommendations based on that history
- Can breach security of the user because it takes personal info and preferences and displays that on the site

## Password Security

- As seen more and more on the web, passwords are required to be more and more sophisticated for the users safety. Modern expectations for a password include:
    - Minimum **10 characters** 
    - Use of both **uppercase** and **lowercase** lettering
    - Contains at least **one number**  
    - Contains at least **one special character**  

## Python Code

```python
import re

def check_password_security(password):
    if len(password) < 10:
        return "Not secure enough: Password must be at least 10 characters long."
    
    if not re.search(r"[A-Z]", password):
        return "Not secure enough: Password must include at least one uppercase letter."
    
    if not re.search(r"[a-z]", password):
        return "Not secure enough: Password must include at least one lowercase letter."
    
    if not re.search(r"\\d", password):
        return "Not secure enough: Password must include at least one number."
    
    return "Password is secure!"

if __name__ == "__main__":
    password = input("Enter your password: ")
    print(check_password_security(password))
```

## Encryption

- Encryption is the process of converting data into a coded format to prevent unauthorized access. It ensures only authorized user can read the information. 

### Popcorn Hack #1

- Using python, finish the standardized passsord security. Add an if statement to require users to use a **special character** when creating their password.

### Popcorn Hack #1 Answer

```python
  if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Not secure enough: Password must include at least one special character."
```
