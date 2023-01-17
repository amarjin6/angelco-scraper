import os
import time

import cloudscraper
from bs4 import BeautifulSoup
from http import HTTPStatus
from fake_useragent import UserAgent
from dotenv import load_dotenv

from core.enums import Location
from core.logger import Logger
from core.printer import Printer


class Parser:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) '
                          'Mobile/15E148',
            'Accept': 'application/json',
            'Accept-Encoding': 'utf-8',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'dnt': '1',
            'sec-ch-ua-platform': 'Linux',
            'sec-ch-device-memory': '8',
            'sec-ch-ua': "'Not?A_Brand';v='8', 'Chromium';v='108', 'Google Chrome';v='108'",
            'sec-ch-ua-arch': "x86",
            'sec-ch-ua-full-version-list': "'Not?A_Brand';v='8.0.0.0', 'Chromium';v='108.0.5359.124',"
                                           " 'Google Chrome';v='108.0.5359.124'",
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': "",
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
        }

        self.target_url = os.getenv('TARGET_URL')
        self.local_url = os.getenv('LOCAL_URL')
        self.global_url = os.getenv('GLOBAL_URL')
        self.remote_url = os.getenv('REMOTE_URL')
        self.log_file = os.getenv('LOG_FILE')
        self.data_file = os.getenv('DATA_FILE')

        self.fieldnames = (
            'company', 'heading', 'position', 'image', 'employees', 'link', 'website', 'social_links', 'location',
            'company_size', 'total_raised', 'skills', 'founders', 'founder_links', 'funding', 'culture'
        )

        self.scraper = cloudscraper.create_scraper()
        Printer.update_data(file=self.data_file, fieldnames=self.fieldnames)

        self.logger = Logger.get_logger(log_file=self.log_file)
        self.logger.info('Parser Invoked')

    def get_job_details(self, link: str) -> dict:
        """Get detailed info about job"""

        try:
            job = self.scraper.get(url=link)

            if job.status_code != HTTPStatus.OK:
                time.sleep(5)
                job = self.scraper.get(url=link)

            if job.status_code != HTTPStatus.OK:
                headers = self.headers
                ua = UserAgent()
                headers['User-Agent'] = ua.random
                time.sleep(5)
                job = self.scraper.get(url=link, headers=headers)

            if job.status_code == HTTPStatus.OK:
                soup = BeautifulSoup(job.text, 'html.parser')

                website_li = soup.find('li', {'class': 'styles_websiteLink___Rnfc'})
                website = website_li.find('a')['href']

                additional_links_div = soup.find('div', {'class': 'styles_component__g_WAp styles_links__VvYv7'})
                additional_links_ul = additional_links_div.find('ul')
                additional_links_li = additional_links_ul.find_all('li')[1:]
                additional_links = []
                for link in additional_links_li:
                    additional_links += link.find_all('a',
                                                      {'class': 'styles_component__UCLp3 styles_defaultLink__eZMqw'})

                social_links = list(dict.fromkeys([link['href'] for link in additional_links]))

                additional_info = soup.find('dl')

                location_dt = additional_info.find_all('dt')[1]
                location_ul = location_dt.find('ul')
                location_li = location_ul.find_all('li')
                location = [location.text for location in location_li]

                company_size = additional_info.find_all('dt')[2].text

                total_raised = additional_info.find_all('dt')[3].text

                skills_span = soup.find_all('span', {
                    'class': 'mb-1 styles-module_component__2E93_ inline-flex flex-row items-center mr-2 last:mr-0'
                             ' rounded-full bg-gray-200 text-gray-700 gap-2 text-xs px-3 py-1'})
                skills = [skill.text for skill in skills_span]

                founders_div = soup.find('div', {'class': 'styles_component__ivX7J styles_twoColumn__XlBrn'})
                founders = founders_div.find_all('a', {'class': 'styles_component__UCLp3 styles_defaultLink__eZMqw'})
                founder_names = list(filter(None, [founder.text for founder in founders]))
                founder_links = list(dict.fromkeys(['https://angel.co' + founder['href'] for founder in founders]))

                funding_div = soup.find('div', {'class': 'styles_component__ivX7J styles_threeColumn__Txyiv'})
                funding_data = funding_div.find_all('h4', {
                    'class': 'styles-module_component__3ZI84 styles_value__Bfjke text-lg font-medium'})
                funding = [funding.text for funding in funding_data]

                culture_h4 = soup.find_all('h4', {
                    'class': 'styles-module_component__3ZI84 styles_name__zCart text-lg font-medium'})
                culture = [culture.text for culture in culture_h4]

                details = {
                    'website': website,
                    'social_links': social_links,
                    'location': location,
                    'company_size': company_size,
                    'total_raised': total_raised,
                    'skills': skills,
                    'founders': founder_names,
                    'founder_links': founder_links,
                    'funding': funding,
                    'culture': culture,
                }

                return details

        except TypeError:
            ...

    def parse(self, location_type: Location, role: str, location: str) -> int:
        """Main parse function"""

        if location_type == Location.LOCAL:
            url = self.local_url.format(role, location)
        elif location_type == Location.REMOTE:
            url = self.remote_url.format(role)
        else:
            url = self.global_url.format(role)

        url += '?page={}'
        page_number = 1

        while True:
            try:
                page = self.scraper.get(url=url.format(page_number))

                if page.status_code == HTTPStatus.OK:
                    soup = BeautifulSoup(page.text, 'html.parser')
                    jobs_div = soup.find('div', {'class': 'styles_results__ZQhDf'})
                    jobs = jobs_div.find_all('div', {'class': 'styles_result__rPRNG'})

                    for job in jobs:
                        try:
                            company = job.find('h4', {'class': 'styles_name__rSxBl'}).text

                            image_div = job.find('div', {'class': 'styles_logo__rR_dS'})
                            image = image_div.find('img')['src'].split('format=auto/')[1]

                            heading = job.find('span', {'class': 'styles_subheader__WPhHT'}).text

                            employees = job.find('span', {'class': 'text-2xs font-medium uppercase'}).text

                            position = job.find('a', {
                                'class': 'styles_component__UCLp3 styles_defaultLink__eZMqw styles_jobTitle___jT4l'}). \
                                text

                            link = self.target_url + str(job.find('a', {
                                'class': 'styles_component__UCLp3 styles_defaultLink__eZMqw styles_logoLink__gyC8B'})[
                                                             'href'])

                            additional_details = self.get_job_details(link)
                            job_data = {
                                'company': company,
                                'image': image,
                                'heading': heading,
                                'employees': employees,
                                'position': position,
                                'link': link,
                                'website': additional_details['website'],
                                'social_links': additional_details['social_links'],
                                'location': additional_details['location'],
                                'company_size': additional_details['company_size'],
                                'total_raised': additional_details['total_raised'],
                                'skills': additional_details['skills'],
                                'founders': additional_details['founders'],
                                'founder_links': additional_details['founder_links'],
                                'funding': additional_details['funding'],
                                'culture': additional_details['culture'],
                            }

                            Printer.save_data(file=self.data_file, fieldnames=self.fieldnames, job=job_data)

                        except AttributeError:
                            ...

                        except TypeError:
                            ...

                elif page.status_code == HTTPStatus.NOT_FOUND:
                    self.logger.info(f'Parser finished successfully')
                    return HTTPStatus.OK
                else:
                    self.logger.error(f'Parser finished with {page.status_code} error')
                    return page.status_code

                page_number += 1

            except AttributeError:
                return HTTPStatus.FORBIDDEN


if __name__ == '__main__':
    load_dotenv(dotenv_path='env/.env')

    num = int(input('Enter position type - [1 - Local, 2 - Global, 3 - Remote]: '))
    match num:
        case 1:
            position_type = Location.LOCAL
        case 2:
            position_type = Location.GLOBAL
        case 3:
            position_type = Location.REMOTE
        case _:
            position_type = Location.LOCAL

    position_role = input('Enter position role - [python-developer, full-stack-engineer, backend-engineer]: ')

    position_location = ''
    if position_type == Location.LOCAL:
        position_location = input('Enter position location - [poland, new-york, los-angeles]: ')

    parser = Parser()
    parser.parse(position_type, position_role, position_location)

