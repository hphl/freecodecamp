(function () {
    function ProjectManager(container) {
        var _projectBuilder = new ProjectBuilder(container);
        var _factoryProjectSelector = new FactoryProjectSelector();
        var _projectSelector = _factoryProjectSelector.create();
        this.loadProjects = function () {
            for (let index = 0; index < 1; index++) {
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
            var divImageContainer = document.createElement('div');
            divImageContainer.classList.add('image-container');
            var projectImage = document.createElement('img');
            projectImage.src = project.getImage();
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
            var _project = new Project("twitch", "https://codepen.io/Xeus/pen/jZEpGe", "");
            _projectSelector.addProject(_project);

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