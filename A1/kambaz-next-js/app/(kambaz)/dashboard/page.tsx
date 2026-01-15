import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />

      <div id="wd-dashboard-courses">

        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">
                Full Stack Software Developer
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/courses/2345" className="wd-dashboard-course-link">
            <Image src="/images/nodejs.jpg" width={200} height={150} alt="nodejs" />
            <div>
              <h5>CS2345 Node JS</h5>
              <p className="wd-dashboard-course-title">
                Server Side Development
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/courses/3456" className="wd-dashboard-course-link">
            <Image src="/images/javascript.jpg" width={200} height={150} alt="javascript" />
            <div>
              <h5>CS3456 JavaScript</h5>
              <p className="wd-dashboard-course-title">
                Modern JavaScript Programming
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/courses/4567" className="wd-dashboard-course-link">
            <Image src="/images/htmlcss.jpg" width={200} height={150} alt="htmlcss" />
            <div>
              <h5>CS4567 HTML & CSS</h5>
              <p className="wd-dashboard-course-title">
                Frontend Web Development
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/courses/5678" className="wd-dashboard-course-link">
            <Image src="/images/python.jpg" width={200} height={150} alt="python" />
            <div>
              <h5>CS5678 Python</h5>
              <p className="wd-dashboard-course-title">
                Programming with Python
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/courses/6789" className="wd-dashboard-course-link">
            <Image src="/images/mongodb.jpg" width={200} height={150} alt="mongodb" />
            <div>
              <h5>CS6789 MongoDB</h5>
              <p className="wd-dashboard-course-title">
                NoSQL Databases
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/courses/7890" className="wd-dashboard-course-link">
            <Image src="/images/devops.jpg" width={200} height={150} alt="devops" />
            <div>
              <h5>CS7890 DevOps</h5>
              <p className="wd-dashboard-course-title">
                Cloud & Deployment
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
