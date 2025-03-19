---
layout: post
title: Safe Computing
description: Team Teach on Safe Computing
type: issues
permalink: /safecomputing
comments: true
---

# Big Idea 5: Safe Computing

## What is PII(Personally Identifiable Information)

- Information identifying a user on the Internet
- Safe computing revolves around this PII and how it is exploited or kept secure
- For example:- Social Security Number, email, full name, driver's license etc.

### Cookies

- A variety of different cookies are used in different sites
- These cookies track your PII, track your history on the site, and provide recommendations based on that history
- Can breach security of the user because it takes personal info and preferences and displays that on the site

## Popcorn Hack 1: Cookies

- Open Developer Tools(fn + F12 -> Application -> Cookies)
- Find cookie from one site and list in a blog:
    - Name, Value, Expiration Date
    
![Cookies Hack](cookieshack.png)

## Password Security

- As seen more and more on the web, passwords are required to be more and more sophisticated for the users safety. Modern expectations for a password include:
    - Minimum **10 characters** 
    - Use of both **uppercase** and **lowercase** lettering
    - Contains at least **one number**  
    - Contains at least **one special character**  

## Python Code: Password Checker

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

### Popcorn Hack #2: Cookies

- Using python, finish the standardized passsord security. Add an if statement to require users to use a **special character** when creating their password.

### Popcorn Hack #2 Answer

```python
  if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Not secure enough: Password must include at least one special character."
```


## Encryption

- Encryption is the process of converting data into a coded format to prevent unauthorized access. It ensures only authorized user can read the information. 
- Types of Encryption
1. Symmetric Encryption (Private Key Encryption)
    - The same key is used for both encryption and decryption
    - Faster but requires securely sharing the key between parties
    - Example: AES (Advance Encryption Standard) used for securing files
2. Asymmetric Encryption (Public Key Encryption)
    - Uses a pair of keys:
        - Public
Key (for encryption)
        - Private key (for decryption)
    - More secure for internet communications since users don't need to share a single key. 
3. Hashing (One-way encryption)
    - Converts data into a fixed length 

string hthat cann## Verification 
tot be reversed.
    - Used for storing passwordss securely. 
    - Example: SHA-256 (Secure Hash Algorithm) used in blockchain and password security. 

### Where Encryption is Used:
- Web Security: HTTPS (SSL/TLS encryption) protects websitess from eavesdropping
- MEssaging Apps: End-to-end encryption


## Verification

- Verification is a crucial aspect of safe computing, ensuring that users, systems, and software are legitimate and secure.
- Uses and types of verification
1. Multi-Factor Authentification (MFA)
    - Added security process that requires users to verify their identity using multiple independent authentication factors.
    - Strengthens security by preventing unauthorized access even if passwords are stolen
    
2. Digital Structures
    - A digital signature is a cryptographic technique used to verify the authenticity and integrity of digital documents, messages, and software
    - Sender would generate a hash, the recipient would decrpt the hash and confirm it matches the original