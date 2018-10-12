(function () {
    function ProjectManager(container) {
        var _projectBuilder = new ProjectBuilder(container);
        var _factoryProjectSelector = new FactoryProjectSelector();
        var _projectSelector = _factoryProjectSelector.create();
        this.loadProjects = function (totalProjects) {
            for (let index = 1; index <= totalProjects; index++) {
                let project = _projectSelector.getProject();

                if (project !== null)
                    _projectBuilder.build(project);
                else
                    break;
            }
        }
    }

    function ProjectBuilder(container) {
        var _container = container;
        this.build = function (project) {
            var projectTile = createTag('div', { className: 'project-tile' });
            var projectUrl = createTag('a', { href: project['url'], target: '_blank' });
            var imageContainer = createTag('div', { className: 'image-container' });
            var projectImage = createTag('img', { className: 'img-responsive', src: project['image'], alt: project['name'] });
            var projectTitle = createTag('div', { className: 'project-title' });

            projectTitle.appendChild(document.createTextNode(project['name']));
            imageContainer.appendChild(projectImage);
            projectUrl.appendChild(imageContainer);
            projectUrl.appendChild(projectTitle);
            projectTile.appendChild(projectUrl);
            _container.appendChild(projectTile);
        }
        var createTag = function (tag, props) {
            var newElement = document.createElement(tag);

            if (props != undefined) {
                Object.keys(props).forEach(function (key) {
                    newElement[key] = props[key];
                });
            }

            return newElement;
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
        var _projectSelector;
        this.create = function () {
            _projectSelector = new ProjectSelector();
            var request = new HttpRequester();
            request.request(parseResponse, "https://raw.githubusercontent.com/hphl/freecodecamp/master/portfolio/data.json");

            return _projectSelector;
        }
        var parseResponse = function (response) {
            var responseObj = JSON.parse(response);

            if (Array.isArray(responseObj)) {
                for (let index = 0; index < responseObj.length; index++) {
                    _projectSelector.addProject(responseObj[index]);
                }
            }
        }
    }

    function HttpRequester() {
        this.request = function (callback, url) {
            if (window.XMLHttpRequest)
                xmlhttp = new XMLHttpRequest();
            else
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            xmlhttp.overrideMimeType("application/json");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                    callback(xmlhttp.responseText);
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    }

    var loadMoreBtn = document.getElementsByClassName("load-more");
    var listProject = document.getElementsByClassName("list-projects");

    if (listProject.length > 0)
        var projectManager = new ProjectManager(listProject[0]);

    if (loadMoreBtn.length > 0) {
        loadMoreBtn[0].addEventListener("click", function (event) {
            projectManager.loadProjects(3);
        });
    }

})();