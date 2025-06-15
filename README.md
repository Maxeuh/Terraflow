<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/Maxeuh/Terraflow">
    <img src="public/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Terraflow</h3>

  <p align="center">
    A Terraform tool to easily create and manage you configurations.
    <br />
    <a href="https://github.com/Maxeuh/Terraflow"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Maxeuh/Terraflow">View Demo</a>
    &middot;
    <a href="https://github.com/Maxeuh/Terraflow/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/Maxeuh/Terraflow/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

Terraflow is a web application that allows you to easily create and manage your Terraform configurations. It provides a user-friendly interface to help you visualize your infrastructure as code, making it easier to manage and deploy your resources.

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>

### Built With

* [![Next][Next.js]][Next-url]

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* bun
  Check if you have bun installed by running `bun -v` in your terminal. If you don't have it installed, you can follow the instructions on the [bun website](https://bun.sh/docs/installation).

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Maxeuh/Terraflow.git
   ```
2. Install all packages
   ```sh
   bun install
   ```
3. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin <your-repository-url>
   ```

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>

## Usage

This application is designed to be user-friendly and intuitive. Once you have installed the application, you can start creating and managing your Terraform configurations.

To run the application, use the following command:

```sh
bun run dev
```
This will start the development server, and you can access the application in your web browser at `http://localhost:3000`.
You can start creating your Terraform configurations by navigating to the appropriate section in the application. The interface will guide you through the process of creating resources, managing state, and deploying your infrastructure.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Create web application
- [ ] Generate a Terraform configuration (HCL)
  - [ ] Retrive options from Terraform providers
- [ ] Generate a cloud-init file

See the [open issues](https://github.com/Maxeuh/Terraflow/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>

### Top contributors:

<a href="https://github.com/Maxeuh/Terraflow/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Maxeuh/Terraflow" alt="contrib.rocks image" />
</a>

## License

Distributed under the GNU GENERAL PUBLIC LICENSE. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">↑ Back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/Maxeuh/Terraflow.svg?style=for-the-badge
[contributors-url]: https://github.com/Maxeuh/Terraflow/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Maxeuh/Terraflow.svg?style=for-the-badge
[forks-url]: https://github.com/Maxeuh/Terraflow/network/members
[stars-shield]: https://img.shields.io/github/stars/Maxeuh/Terraflow.svg?style=for-the-badge
[stars-url]: https://github.com/Maxeuh/Terraflow/stargazers
[issues-shield]: https://img.shields.io/github/issues/Maxeuh/Terraflow.svg?style=for-the-badge
[issues-url]: https://github.com/Maxeuh/Terraflow/issues
[license-shield]: https://img.shields.io/github/license/Maxeuh/Terraflow.svg?style=for-the-badge
[license-url]: https://github.com/Maxeuh/Terraflow/LICENSE.txt
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 