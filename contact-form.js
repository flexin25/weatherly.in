const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
     
        console.log('Form submitted:', { name, email, message });

        alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
  
        contactForm.reset();
    });
}
