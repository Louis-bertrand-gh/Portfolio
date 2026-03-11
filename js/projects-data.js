/**
 * projects-data.js
 * ─────────────────────────────────────────────────────────────────
 * Source unique de la liste des projets actifs.
 * Utilisé par index.html (DATA.projects) et les pages projet
 * (navigation "Projet suivant").
 *
 * ➜ Pour ajouter/retirer un projet : commenter/décommenter ici.
 *   Tout le reste (index + navigation) se met à jour tout seul.
 * ─────────────────────────────────────────────────────────────────
 */

const PROJECTS_LIST = [
  {
    title: "Infrastructure Réseau Complète",
    tech: ["Réseaux", "Services", "Cybersécurité"],
    desc: "Déploiement d'une infrastructure réseau complète dans un labo de test.",
    link: "projects/network-infrastructure.html",
    image: "images/infrastructure.png",
    zoom: 100,
  },
  /*{
    title: "Serveur de Virtualisation",
    tech: ["Proxmox", "VirtualBox", "Debian"],
    desc: "Hyperviseur Proxmox hébergeant plusieurs VMs avec snapshots automatisés et gestion fine des ressources.",
    link: "projects/proxmox-server.html",
    image: "images/proxmox.png",
    zoom: 100,
  },
  {
    title: "Déploiement Ansible",
    tech: ["Ansible", "Linux", "YAML"],
    desc: "Automatisation du déploiement de serveurs Linux via des playbooks Ansible pour réduire les erreurs de configuration.",
    link: "projects/ansible-deployment.html",
    image: "images/ansible-deployment.png",
    zoom: 100,
  },
  {
    title: "Audit Sécurité Réseau",
    tech: ["Nmap", "Wireshark", "pfSense"],
    desc: "Évaluation des vulnérabilités d'une infrastructure réseau, identification des menaces et mise en place de contre-mesures.",
    link: "projects/network-audit.html",
    image: "images/network-audit.png",
    zoom: 100,
  },
  {
    title: "Déploiement Ansible Avancé",
    tech: ["Ansible", "Linux", "YAML"],
    desc: "Automatisation du déploiement de serveurs Linux via des playbooks Ansible pour réduire les erreurs de configuration.",
    link: "projects/ansible-advanced.html",
    image: "images/ansible-advanced.png",
    zoom: 100,
  },*/
  {
    title: "Documentation Technique",
    tech: ["Markdown", "GitHub Pages", "Documentation"],
    desc: "Documentation complète d'un projet avec architecture, procédures et guides d'utilisation sur plateau sportludique.",
    link: "https://xola-max.github.io/gp-orleans-sportludique2025-2026/",
    image: "/images/documentation-projet.png",
    zoom: 150,
  },
];
