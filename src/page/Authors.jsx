import React from "react";
import "./Authors.css";

const Author = () => {
  return (
    <section className="author-section">
      <div className="banner">
        <img
          src="/page/bannerwriter.png"
          alt="Banner"
          className="banner-image"
        />
      </div>

      <br />

      <div className="author-text">
        <h2 className="author-title">Top 3 Most Readable & Renowned Authors</h2>
        <p className="author-subtitle">
          Celebrating the voices that inspire, empower, and transform through
          words.
        </p>
      </div>

      {/* author -card*/}
      <div className="author-card" style={{ backgroundColor: "#B0E0E6" }}>
        <div className="author-image-wrapper">
          <img
            src="/public/authors/MatthewLim.png"
            alt="Author1"
            className="author-card-image"
          />
        </div>
        <div className="author-info">
          <h2 className="author-genre">
            Genre & Writing Focus: Fiction, LGBTQ+ Romance
          </h2>
          <h3 className="author-name">Matthew Lim</h3>
          <p className="author-bio">
            <strong>Bio:</strong> Matthew Lim is a passionate storyteller who
            writes heartwarming and th+ought-provoking LGBTQ+ romance novels.
            With a background in creative writing, he explores themes of love,
            identity, and self-discovery in every piece.
          </p>
          <div className="author-works">
            <h4>Works:</h4>
            <div className="works-images">
              <img src="/public/books/1book1.png" alt="Book 1" />
              <img src="/public/books/1book2.png" alt="Book 2" />
              <img src="/public/books/1book3.png" alt="Book 3" />
              <img src="/public/books/1book4.png" alt="Book 4" />
            </div>
          </div>
        </div>
      </div>

      <div className="author-card" style={{ backgroundColor: "#B5EAD7" }}>
        <div className="author-image-wrapper">
          <img
            src="/public/authors/HazelVillanueva.png"
            alt="Author1"
            className="author-card-image"
          />
        </div>
        <div className="author-info">
          <h2 className="author-genre">
            Genre & Writing Focus: Poetry, LGBTQ+ Identity
          </h2>
          <h3 className="author-name">Hazel Villanueva</h3>
          <p className="author-bio">
            <strong>Bio:</strong> Hazel Villanueva is a poet and activist whose
            work centers around the LGBTQ+ experience, self-expression, and
            resilience. Through raw and emotional poetry, Jordan aims to give a
            voice to those often unheard.
          </p>
          <div className="author-works">
            <h4>Works:</h4>
            <div className="works-images">
              <img src="/public/books/2book1.png" alt="Book 1" />
              <img src="/public/books/2book2.png" alt="Book 2" />
              <img src="/public/books/2book3.png" alt="Book 3" />
              <img src="/public/books/2book4.png" alt="Book 4" />
            </div>
          </div>
        </div>
      </div>

      {/* creation this */}
      <div className="author-grid">
        <div className="author-card-grid">
          <img
            src="/public/books/2book2.png"
            alt="work"
            className="work-card-image"
          />
          <div className="work-card-content">
            <h3 className="work-name">Lorem ipsum</h3>
            <p className="work-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              qui tempora aperiam iusto.?
            </p>
          </div>
        </div>

        <div className="author-card-grid">
          <img
            src="/public/books/1book4.png"
            alt="Author"
            className="work-card-image"
          />
          <div className="work-card-content">
            <h3 className="work-name">Lorem ipsum</h3>
            <p className="work-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              qui tempora aperiam iusto.?
            </p>
          </div>
        </div>

        <div className="author-card-grid">
          <img
            src="/public/books/1book2.png"
            alt="Author"
            className="work-card-image"
          />
          <div className="work-card-content">
            <h3 className="work-name">Lorem ipsum</h3>
            <p className="work-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              qui tempora aperiam iusto.?
            </p>
          </div>
        </div>

        <div className="author-card-grid">
          <img
            src="/public/books/2book4.png"
            alt="Author"
            className="work-card-image"
          />
          <div className="work-card-content">
            <h3 className="work-name">Lorem ipsum</h3>
            <p className="work-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              qui tempora aperiam iusto.?
            </p>
          </div>
        </div>

        <div className="author-card-grid">
          <img
            src="/public/books/1book3.png"
            alt="Author"
            className="work-card-image"
          />
          <div className="work-card-content">
            <h3 className="work-name">Lorem ipsum</h3>
            <p className="work-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              qui tempora aperiam iusto.?
            </p>
          </div>
        </div>

        <div className="author-card-grid">
          <img
            src="/public/books/2book3.png"
            alt="Author"
            className="work-card-image"
          />
          <div className="work-card-content">
            <h3 className="work-name">Lorem ipsum</h3>
            <p className="work-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              qui tempora aperiam iusto.?
            </p>
          </div>
        </div>
      </div>
    </section>

    // footerpa
  );
};

export default Author;
