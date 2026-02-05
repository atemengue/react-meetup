import { useState, FormEvent, ChangeEvent } from 'react';
import './UseStateExample.css';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const UseStateExample = () => {
  // État local pour chaque champ du formulaire
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  // Gestion du changement de valeur
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur si l'utilisateur modifie le champ
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validation du formulaire
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log('Formulaire soumis:', formData);
      setSubmitted(true);
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="module-container">
      <h1>useState - Formulaire de Contact</h1>
      <p className="subtitle">Gestion d'état local simple avec validation</p>

      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>useState</strong> est le hook le plus basique pour gérer l'état local d'un composant.
          Parfait pour des états simples et indépendants.
        </p>
        <p>
          Dans cet exemple, nous gérons un formulaire avec 3 états différents :
        </p>
        <ul>
          <li><code>formData</code> - les données du formulaire</li>
          <li><code>errors</code> - les erreurs de validation</li>
          <li><code>submitted</code> - l'état de soumission</li>
        </ul>
      </div>

      <div className="form-container">
        {submitted && (
          <div className="success-message">
            Merci {formData.name}! Votre message a été envoyé avec succès.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Envoyer
          </button>
        </form>

        <div className="code-preview">
          <h4>État actuel du formulaire:</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default UseStateExample;
