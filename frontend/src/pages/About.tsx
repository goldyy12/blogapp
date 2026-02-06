import React from "react";
import "../styles/about.css";

export default function About() {
    return (
        <div className="about-container">
            <h1>About Our Blog</h1>

            <section className="mission">
                <h2>Our Mission</h2>
                <p>
                    Welcome to our blog platform! Our mission is to create a space where people can share ideas, knowledge, and experiences.
                    We believe in the power of community and open dialogue.
                </p>
                <p>
                    This platform was built with modern technologies to provide a seamless and enjoyable experience for both readers and content creators.
                </p>
            </section>

            <section className="features">
                <h2>Features</h2>
                <ul>
                    <li>User authentication and profile management</li>
                    <li>Create, edit, and delete blog posts</li>
                    <li>Comment system for engaging with posts</li>
                    <li>Responsive design for all devices</li>
                    <li>Admin dashboard for content moderation</li>
                </ul>
            </section>

            <section className="technologies">
                <h2>Technologies Used</h2>
                <div className="tech-cards">
                    <div className="tech-card">
                        <h3>Frontend</h3>
                        <ul>
                            <li>React</li>
                            <li>React Router</li>
                            <li>Tailwind CSS</li>
                            <li>Vite</li>
                        </ul>
                    </div>

                    <div className="tech-card">
                        <h3>Backend</h3>
                        <ul>
                            <li>Node.js</li>
                            <li>Express</li>
                            <li>PostgreSQL</li>
                            <li>Prisma ORM</li>
                        </ul>
                    </div>

                    <div className="tech-card">
                        <h3>Authentication</h3>
                        <ul>
                            <li>JWT</li>
                            <li>Passport.js</li>
                            <li>bcrypt</li>
                            <li>HTTP-only cookies</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
