// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a backend server
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', { name, email, message });
        
        // Show success message (you can customize this)
        alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
        
        // Reset form
        contactForm.reset();
        
        // Optional: If you want to integrate with a service like Formspree or EmailJS:
        // Example with Formspree:
        // fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, message })
        // }).then(response => {
        //     if (response.ok) {
        //         alert('Message sent successfully!');
        //         contactForm.reset();
        //     }
        // });
    });
}
