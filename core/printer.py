import csv


class Printer:
    @staticmethod
    def update_data(file: str, fieldnames: tuple) -> None:
        """Update recently stored data"""

        with open(file, 'w') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

    @staticmethod
    def get_data(file: str, fieldnames: tuple) -> list:
        """Get previous saved data"""

        with open(file, 'r') as f:
            reader = csv.DictReader(f, fieldnames=fieldnames)
            data = list(reader)

        return data

    @staticmethod
    def save_data(file: str, fieldnames: tuple, job: dict) -> None:
        """Retrieve the data stored in the file"""

        previous_data = Printer.get_data(file, fieldnames)
        with open(file, 'w') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            for data in previous_data:
                writer.writerow(data)

            writer.writerow(job)

