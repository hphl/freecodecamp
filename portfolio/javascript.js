(function () {
    function ProjectManager(container) {
        var _projectBuilder = new ProjectBuilder(container);
        var _factoryProjectSelector = new FactoryProjectSelector();
        var _projectSelector = _factoryProjectSelector.create();
        this.loadProjects = function () {
            for (let index = 1; index <= 3; index++) {
                let project = _projectSelector.getProject();

                if (project !== null)
                    _projectBuilder.build(project);
            }
        }
    }

    function Project(name, url, image) {
        var _name = name;
        var _url = url;
        var _image = image;
        this.getName = function () {
            return _name;
        }
        this.getUrl = function () {
            return _url;
        }
        this.getImage = function () {
            return _image;
        }
    }

    function ProjectBuilder(container) {
        var _container = container;
        this.build = function (project) {
            var divProject = document.createElement('div');
            divProject.classList.add('project-tile');
            var projectUrl = document.createElement('a');
            projectUrl.href = project.getUrl();
            projectUrl.target = '_blank';
            var divImageContainer = document.createElement('div');
            divImageContainer.classList.add('image-container');
            var projectImage = document.createElement('img');
            projectImage.classList.add('img-responsive');
            projectImage.src = project.getImage();
            projectImage.alt = project.getName();
            var divProjectTitle = document.createElement('div');
            divProjectTitle.classList.add('project-title');
            var projectTitle = document.createTextNode(project.getName());
            divProjectTitle.appendChild(projectTitle);

            divImageContainer.appendChild(projectImage);

            projectUrl.appendChild(divImageContainer);
            projectUrl.appendChild(divProjectTitle);

            divProject.appendChild(projectUrl);

            _container.appendChild(divProject);
        }
    }

    function ProjectSelector() {
        var _listProjects = [];
        var _index = 0;
        this.addProject = function (project) {
            _listProjects.push(project);
        }
        this.getProject = function () {
            if (_index < _listProjects.length) {
                _index++;
                return _listProjects[_index - 1];
            }

            return null;
        }
    }

    function FactoryProjectSelector() {
        this.create = function () {
            var _projectSelector = new ProjectSelector();
            var _projectTwitch = new Project("twitch tv",
                "https://codepen.io/Xeus/pen/jZEpGe",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/twitch_tv.png");
            var _projectWiki = new Project("wikipedia viewer",
                "https://codepen.io/Xeus/pen/ddyRNv",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/wikipedia_viewer.png");
            var _projectWeather = new Project("local weather",
                "https://codepen.io/Xeus/pen/yvLXar",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/local_weather.png");
            var _projectQuote = new Project("quote machine",
                "https://codepen.io/Xeus/pen/opVGrm",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/quote_machine.png");
            var _projectTechnical = new Project("technical documentation",
                "https://codepen.io/Xeus/pen/BOLvda",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/technical_documentation_page.png");
            var _projectProduct = new Project("product landing page",
                "https://codepen.io/Xeus/pen/YjdwoO",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/product_landing_page.png");
            var _projectTribute = new Project("tribute page",
                "https://codepen.io/Xeus/pen/LzemXa",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/tribute_page.png");
            var _projectPomodoro = new Project("pomodoro clock",
                "https://codepen.io/Xeus/pen/gzMyOq",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/pomodoro_clock.png");
            var _projectCalculator = new Project("calculator",
                "https://codepen.io/Xeus/pen/yKovvK",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/calculator.png");
            var _projectSurvey = new Project("survey form",
                "https://codepen.io/Xeus/pen/BPPBKw",
                "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/images/survey_form.png");
            _projectSelector.addProject(_projectTwitch);
            _projectSelector.addProject(_projectWiki);
            _projectSelector.addProject(_projectWeather);
            _projectSelector.addProject(_projectQuote);
            _projectSelector.addProject(_projectTechnical);
            _projectSelector.addProject(_projectProduct);
            _projectSelector.addProject(_projectTribute);
            _projectSelector.addProject(_projectPomodoro);
            _projectSelector.addProject(_projectCalculator);
            _projectSelector.addProject(_projectSurvey);

            return _projectSelector;
        }
    }

    var loadMoreBtn = document.getElementsByClassName("load-more");
    var listProject = document.getElementsByClassName("list-projects");

    if (listProject.length > 0)
        var projectManager = new ProjectManager(listProject[0]);

    if (loadMoreBtn.length > 0) {
        loadMoreBtn[0].addEventListener("click", function (event) {
            projectManager.loadProjects();
        });
    }
})();