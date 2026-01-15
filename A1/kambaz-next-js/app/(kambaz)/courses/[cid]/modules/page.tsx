export default function Modules() {
  return (
    <div>
      {/* Top action bar */}
      <div>
        <button id="wd-collapse-all">Collapse All</button>
        <button id="wd-view-progress">View Progress</button>

        <select id="wd-publish-all">
          <option value="PUBLISH_ALL">Publish All</option>
          <option value="PUBLISH_ALL_MODULES">Publish all modules</option>
          <option value="PUBLISH_ALL_LESSONS">Publish all lessons</option>
          <option value="PUBLISH_ALL_CONTENT">Publish all content</option>
        </select>

        <button id="wd-add-module">+ Module</button>
      </div>

      <hr />
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>

          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>

              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="wd-module">
          <div className="wd-title">Week 2</div>
        </li>

        <li className="wd-module">
          <div className="wd-title">Week 3</div>
        </li>
      </ul>
    </div>
  );
}
