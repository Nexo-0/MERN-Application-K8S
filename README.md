# MERN Application with Kubernetes

A containerized **MERN stack application** deployed using **Docker and Kubernetes**.

This project demonstrates how a full-stack application can be separated into frontend, backend, and database components and deployed as independently managed workloads inside a Kubernetes cluster.

---

## 🖥️ Application Preview

The application provides a simple **User Management** interface where users can be created, viewed, and deleted.

![MERN Kubernetes Application Preview](./images/application-preview.png)

---

## 🚀 Project Overview

The application is built using the MERN stack:

- **MongoDB** — Database
- **Express.js** — Backend framework
- **React** — Frontend
- **Node.js** — Backend runtime

The application is containerized using **Docker** and deployed using **Kubernetes**.

### High-Level Architecture

```text
                        ┌───────────────────┐
                        │       User        │
                        │     Browser       │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │  React Frontend   │
                        │    + Nginx        │
                        └─────────┬─────────┘
                                  │
                                  │ API Requests
                                  ▼
                        ┌───────────────────┐
                        │  Node.js Backend  │
                        │    + Express      │
                        └─────────┬─────────┘
                                  │
                                  │ Database Requests
                                  ▼
                        ┌───────────────────┐
                        │      MongoDB      │
                        └───────────────────┘
