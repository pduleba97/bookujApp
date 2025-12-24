import './ServicesNavbar.css'
import {Link} from 'react-router-dom'

function ServicesNavbar ()
{
    return(
        <nav className='services-navbar'>
            <ul>
                <li><Link to="/">Fryzjer</Link></li>
                <li><Link to="/">Barber shop</Link></li>
                <li><Link to="/">Salon Kosmetyczny</Link></li>
                <li><Link to="/">Paznokcie</Link></li>
                <li><Link to="/">Brwi i rzęsy</Link></li>
                <li><Link to="/">Masaż</Link></li>
                <li><Link to="/">Zwierzaki</Link></li>
                <li><Link to="/">Fizjoterapia</Link></li>
            </ul>
        </nav>
    )
}

export default ServicesNavbar