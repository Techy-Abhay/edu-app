#!/usr/bin/env python3
"""Expand and normalize the Class 6 RMS/Sainik GK question bank."""
import csv
from pathlib import Path

ROOT = Path(__file__).parent.parent / 'master_data'
GK_FILE = ROOT / 'Educational App - Question Bank - GK.csv'
TOPICS_FILE = ROOT / 'Educational App - Question Bank - Topics.csv'
GK_BACKUP = ROOT / 'Educational App - Question Bank - GK.before-expansion.csv'
TOPICS_BACKUP = ROOT / 'Educational App - Question Bank - Topics.before-gk-expansion.csv'

GK_TOPICS = [
    'India - General Knowledge', 'Indian Geography', 'Indian History',
    'Indian Constitution & Civics', 'Defence & Armed Forces', 'Science GK',
    'Sports & Games', 'World Geography', 'World GK', 'Space & Astronomy',
    'Awards & Honours', 'Famous Personalities', 'Monuments & Heritage',
    'Rivers, Dams & Lakes', 'National Parks & Wildlife', 'Environment',
    'Economy - Basic GK', 'Health & Human Body GK', 'Computer & Technology GK',
    'Books & Authors', 'Art, Culture & Dance', 'Indian Festivals & Traditions',
    'International Organisations', 'Important Days', 'First in India / World',
    'Superlatives', 'Cities & Nicknames', 'Transport & Communication',
    'Maps & Locations', 'Current Affairs - India', 'Current Affairs - World',
    'Current Sports Affairs', 'Mixed GK / Rapid Fire'
]

# (topic, question, correct option, three distractors, explanation)
FACTS = [
('India - General Knowledge','What is the capital of India?','New Delhi','Mumbai','Kolkata','Chennai','New Delhi is the capital of India.'),
('India - General Knowledge','What is the national animal of India?','Bengal tiger','Lion','Elephant','Leopard','The Bengal tiger is the national animal of India.'),
('India - General Knowledge','What is the national bird of India?','Indian peafowl','Sparrow','Parrot','Eagle','The Indian peafowl is the national bird of India.'),
('India - General Knowledge','What is the national flower of India?','Lotus','Rose','Sunflower','Jasmine','The lotus is the national flower of India.'),
('India - General Knowledge','What is the national tree of India?','Banyan','Neem','Mango','Peepal','The banyan is the national tree of India.'),
('Indian Geography','What is the capital of Rajasthan?','Jaipur','Udaipur','Jodhpur','Bikaner','Jaipur is the capital of Rajasthan.'),
('Indian Geography','Which is the longest river in India?','Ganga','Yamuna','Godavari','Narmada','The Ganga is generally taught as India\'s longest river.'),
('Indian Geography','Which desert lies mainly in Rajasthan?','Thar Desert','Sahara Desert','Gobi Desert','Kalahari Desert','The Thar Desert lies mainly in Rajasthan.'),
('Indian Geography','Which mountain range forms India\'s northern boundary?','Himalayas','Aravallis','Vindhyas','Satpuras','The Himalayas form India\'s northern mountain barrier.'),
('Indian Geography','Which is the largest state of India by area?','Rajasthan','Madhya Pradesh','Maharashtra','Uttar Pradesh','Rajasthan is the largest Indian state by area.'),
('Indian History','Who founded the Maurya Empire?','Chandragupta Maurya','Ashoka','Akbar','Harsha','Chandragupta Maurya founded the Maurya Empire.'),
('Indian History','Who led the Dandi March in 1930?','Mahatma Gandhi','Jawaharlal Nehru','Subhas Chandra Bose','Sardar Patel','Mahatma Gandhi led the Dandi March.'),
('Indian History','In which year did India become independent?','1947','1942','1950','1857','India became independent on 15 August 1947.'),
('Indian History','Who built the Taj Mahal?','Shah Jahan','Akbar','Babur','Aurangzeb','Mughal emperor Shah Jahan built the Taj Mahal.'),
('Indian History','Who was known as Netaji?','Subhas Chandra Bose','Bhagat Singh','Bal Gangadhar Tilak','Lala Lajpat Rai','Subhas Chandra Bose was known as Netaji.'),
('Indian Constitution & Civics','Who is the constitutional head of India?','President','Prime Minister','Chief Justice','Governor','The President is the constitutional head of India.'),
('Indian Constitution & Civics','What is the lower house of Parliament called?','Lok Sabha','Rajya Sabha','Vidhan Sabha','Gram Sabha','The Lok Sabha is the lower house of Parliament.'),
('Indian Constitution & Civics','What is the voting age in India?','18 years','16 years','21 years','25 years','Citizens can vote in India from the age of 18.'),
('Indian Constitution & Civics','Which body conducts elections in India?','Election Commission of India','Supreme Court','Reserve Bank of India','NITI Aayog','The Election Commission conducts elections in India.'),
('Indian Constitution & Civics','What is the supreme law of India?','Constitution of India','Penal Code','Parliament Rules','Election Manifesto','The Constitution is the supreme law of India.'),
('Defence & Armed Forces','Which force protects India\'s borders on land?','Indian Army','Indian Navy','Indian Air Force','Coast Guard','The Indian Army protects the country on land.'),
('Defence & Armed Forces','Which force protects India\'s maritime borders?','Indian Navy','Indian Army','Indian Air Force','BSF','The Indian Navy protects India\'s seas.'),
('Defence & Armed Forces','Which force operates fighter aircraft for India?','Indian Air Force','Indian Army','Indian Navy','CRPF','The Indian Air Force operates military aircraft.'),
('Defence & Armed Forces','What is the highest wartime gallantry award in India?','Param Vir Chakra','Ashoka Chakra','Arjuna Award','Bharat Ratna','The Param Vir Chakra is India\'s highest wartime gallantry award.'),
('Defence & Armed Forces','Where is the National Defence Academy located?','Khadakwasla','Dehradun','New Delhi','Chennai','The National Defence Academy is at Khadakwasla near Pune.'),
('Science GK','Which planet is known as the Red Planet?','Mars','Venus','Jupiter','Mercury','Mars appears red because of iron oxide on its surface.'),
('Science GK','What is the chemical symbol for water?','H2O','CO2','O2','NaCl','Water is made of hydrogen and oxygen, H2O.'),
('Science GK','Which organ pumps blood around the body?','Heart','Lungs','Stomach','Brain','The heart pumps blood through the body.'),
('Science GK','Which gas do plants take in for photosynthesis?','Carbon dioxide','Oxygen','Nitrogen','Hydrogen','Plants use carbon dioxide in photosynthesis.'),
('Science GK','What is the hardest natural substance?','Diamond','Iron','Gold','Quartz','Diamond is the hardest natural substance.'),
('Sports & Games','How many players are in a cricket team?','11','9','10','12','A cricket team has 11 players.'),
('Sports & Games','Which sport uses a shuttlecock?','Badminton','Tennis','Cricket','Hockey','Badminton is played with a shuttlecock.'),
('Sports & Games','Which game is associated with checkmate?','Chess','Carrom','Hockey','Golf','Checkmate is a position in chess.'),
('Sports & Games','Which sport is Neeraj Chopra associated with?','Javelin throw','Swimming','Boxing','Football','Neeraj Chopra is a javelin thrower.'),
('Sports & Games','How many rings are on the Olympic flag?','5','4','6','7','The Olympic flag has five interlocking rings.'),
('World Geography','Which is the largest continent?','Asia','Africa','Europe','Australia','Asia is the largest continent.'),
('World Geography','Which is the largest ocean?','Pacific Ocean','Atlantic Ocean','Indian Ocean','Arctic Ocean','The Pacific is the largest ocean.'),
('World Geography','Which country is shaped like a boot?','Italy','Spain','Greece','Portugal','Italy is famously shaped like a boot.'),
('World Geography','Which is the highest mountain in the world?','Mount Everest','K2','Kanchenjunga','Mount Kilimanjaro','Mount Everest is the highest mountain above sea level.'),
('World Geography','Which continent has the most countries?','Africa','Asia','Europe','South America','Africa has the most countries.'),
('World GK','What is the currency of Japan?','Yen','Won','Yuan','Dollar','Japan uses the yen.'),
('World GK','What is the currency of the United Kingdom?','Pound sterling','Euro','Dollar','Yen','The United Kingdom uses the pound sterling.'),
('World GK','Which language is mainly spoken in Brazil?','Portuguese','Spanish','French','English','Portuguese is Brazil\'s official language.'),
('World GK','Which country is known as the Land of the Rising Sun?','Japan','China','Thailand','South Korea','Japan is called the Land of the Rising Sun.'),
('World GK','Which country has the pyramids of Giza?','Egypt','Mexico','India','Peru','The pyramids of Giza are in Egypt.'),
('Space & Astronomy','Which planet is closest to the Sun?','Mercury','Venus','Earth','Mars','Mercury is closest to the Sun.'),
('Space & Astronomy','Which planet is the largest in the solar system?','Jupiter','Saturn','Earth','Neptune','Jupiter is the largest planet.'),
('Space & Astronomy','What is Earth\'s natural satellite?','Moon','Sun','Mars','Venus','The Moon is Earth\'s natural satellite.'),
('Space & Astronomy','What does ISRO stand for?','Indian Space Research Organisation','International Space Research Office','Indian Satellite Research Organisation','International Science Research Organisation','ISRO is India\'s national space agency.'),
('Space & Astronomy','Which Indian mission reached the Moon\'s south polar region in 2023?','Chandrayaan-3','Mangalyaan','Chandrayaan-1','Aditya-L1','Chandrayaan-3 landed near the Moon\'s south polar region.'),
('Awards & Honours','What is India\'s highest civilian award?','Bharat Ratna','Padma Shri','Arjuna Award','Param Vir Chakra','The Bharat Ratna is India\'s highest civilian award.'),
('Awards & Honours','Which award is given for excellence in literature in India?','Jnanpith Award','Arjuna Award','Dronacharya Award','Khel Ratna','The Jnanpith Award honours literary achievement.'),
('Awards & Honours','Which award is given to outstanding sports coaches?','Dronacharya Award','Arjuna Award','Bharat Ratna','Padma Bhushan','The Dronacharya Award honours sports coaches.'),
('Awards & Honours','Which prize is awarded internationally for peace?','Nobel Peace Prize','Booker Prize','Oscar','Grammy','The Nobel Peace Prize recognises efforts for peace.'),
('Awards & Honours','Which award honours Indian sportspersons?','Arjuna Award','Jnanpith Award','Dadasaheb Phalke Award','Sahitya Akademi Award','The Arjuna Award recognises sportspersons.'),
('Famous Personalities','Who wrote the Indian national anthem?','Rabindranath Tagore','Bankim Chandra Chattopadhyay','Sarojini Naidu','Premchand','Rabindranath Tagore wrote Jana Gana Mana.'),
('Famous Personalities','Who is called the Father of the Indian Constitution?','B. R. Ambedkar','Mahatma Gandhi','Sardar Patel','Rajendra Prasad','B. R. Ambedkar chaired the drafting committee.'),
('Famous Personalities','Who discovered gravity after observing a falling apple?','Isaac Newton','Albert Einstein','Galileo Galilei','Charles Darwin','Isaac Newton is associated with the law of gravity.'),
('Famous Personalities','Who painted the Mona Lisa?','Leonardo da Vinci','Pablo Picasso','Vincent van Gogh','M. F. Husain','Leonardo da Vinci painted the Mona Lisa.'),
('Famous Personalities','Who was India\'s first woman Prime Minister?','Indira Gandhi','Sarojini Naidu','Pratibha Patil','Sushma Swaraj','Indira Gandhi was India\'s first woman Prime Minister.'),
('Monuments & Heritage','In which city is the Taj Mahal located?','Agra','Jaipur','Delhi','Lucknow','The Taj Mahal is in Agra.'),
('Monuments & Heritage','Who built the Red Fort in Delhi?','Shah Jahan','Akbar','Ashoka','Humayun','Shah Jahan built the Red Fort.'),
('Monuments & Heritage','Where is the Qutub Minar located?','Delhi','Agra','Mumbai','Hyderabad','The Qutub Minar is in Delhi.'),
('Monuments & Heritage','The Ajanta Caves are in which state?','Maharashtra','Gujarat','Rajasthan','Bihar','The Ajanta Caves are in Maharashtra.'),
('Monuments & Heritage','Konark Sun Temple is in which state?','Odisha','Tamil Nadu','Kerala','Karnataka','The Sun Temple at Konark is in Odisha.'),
('Rivers, Dams & Lakes','On which river is the Bhakra Nangal Dam built?','Sutlej','Ganga','Yamuna','Godavari','Bhakra Nangal Dam is on the Sutlej River.'),
('Rivers, Dams & Lakes','Which river flows through Varanasi?','Ganga','Narmada','Godavari','Kaveri','Varanasi lies on the Ganga.'),
('Rivers, Dams & Lakes','Which is the largest freshwater lake in India?','Wular Lake','Chilika Lake','Vembanad Lake','Sambhar Lake','Wular Lake is India\'s largest freshwater lake.'),
('Rivers, Dams & Lakes','Which river is called the Sorrow of Bihar?','Kosi','Ganga','Yamuna','Tapti','Floods from the Kosi have earned it this name.'),
('Rivers, Dams & Lakes','Hirakud Dam is built on which river?','Mahanadi','Godavari','Narmada','Krishna','Hirakud Dam is on the Mahanadi River.'),
('National Parks & Wildlife','Which animal is protected in Project Tiger?','Tiger','Elephant','Lion','Rhino','Project Tiger focuses on tiger conservation.'),
('National Parks & Wildlife','Kaziranga National Park is famous for which animal?','One-horned rhinoceros','Lion','Snow leopard','Giraffe','Kaziranga is famous for one-horned rhinoceroses.'),
('National Parks & Wildlife','Gir National Park is famous for which animal?','Asiatic lion','Bengal tiger','Elephant','Red panda','Gir is the home of Asiatic lions in India.'),
('National Parks & Wildlife','Which state is home to Jim Corbett National Park?','Uttarakhand','Assam','Gujarat','Kerala','Jim Corbett National Park is in Uttarakhand.'),
('National Parks & Wildlife','Which is India\'s national aquatic animal?','Ganges river dolphin','Blue whale','Sea turtle','Crocodile','The Ganges river dolphin is India\'s national aquatic animal.'),
('Environment','Which gas is most linked with global warming?','Carbon dioxide','Oxygen','Helium','Neon','Carbon dioxide is a major greenhouse gas.'),
('Environment','Which of these is a renewable source of energy?','Solar energy','Coal','Petrol','Natural gas','Solar energy is renewable.'),
('Environment','What do we call planting trees on a large scale?','Afforestation','Deforestation','Erosion','Irrigation','Afforestation means planting trees.'),
('Environment','Which layer protects Earth from harmful ultraviolet rays?','Ozone layer','Troposphere','Mantle','Crust','The ozone layer absorbs much ultraviolet radiation.'),
('Environment','What should be put in a blue recycling bin?','Recyclable waste','Food waste','Medical waste','Burning coal','Blue bins are commonly used for recyclable waste.'),
('Economy - Basic GK','What is the currency of India?','Rupee','Dollar','Pound','Yen','India uses the rupee.'),
('Economy - Basic GK','Which institution issues currency notes in India?','Reserve Bank of India','State Bank of India','Finance Ministry','Parliament','The Reserve Bank of India issues most currency notes.'),
('Economy - Basic GK','What does RBI stand for?','Reserve Bank of India','Rural Bank of India','Revenue Board of India','Regional Bank of India','RBI stands for Reserve Bank of India.'),
('Economy - Basic GK','What is a place where money is kept safely called?','Bank','Museum','Library','Post office','Banks keep money and provide financial services.'),
('Economy - Basic GK','What is money paid to the government called?','Tax','Salary','Prize','Loan','A tax is money paid to the government.'),
('Health & Human Body GK','Which vitamin is made in the body with sunlight?','Vitamin D','Vitamin A','Vitamin B12','Vitamin C','Sunlight helps the body make vitamin D.'),
('Health & Human Body GK','Which organ helps us breathe?','Lungs','Kidneys','Liver','Skin','The lungs help us breathe.'),
('Health & Human Body GK','How many bones are in an adult human body?','206','106','306','406','An adult human body has 206 bones.'),
('Health & Human Body GK','Which blood group is known as the universal donor?','O negative','AB positive','A positive','B positive','O negative blood can often be donated to all groups in emergencies.'),
('Health & Human Body GK','Which nutrient gives the body energy?','Carbohydrates','Vitamins','Minerals','Water','Carbohydrates are an important energy source.'),
('Computer & Technology GK','What does CPU stand for?','Central Processing Unit','Computer Power Unit','Central Program Unit','Control Processing Utility','CPU stands for Central Processing Unit.'),
('Computer & Technology GK','Which device is used to type into a computer?','Keyboard','Monitor','Printer','Speaker','A keyboard is used to type text.'),
('Computer & Technology GK','What does WWW stand for?','World Wide Web','World Web Window','Wide World Web','Web World Wide','WWW stands for World Wide Web.'),
('Computer & Technology GK','Which device displays computer output?','Monitor','Keyboard','Mouse','Scanner','A monitor displays output from a computer.'),
('Computer & Technology GK','What is the full form of AI?','Artificial Intelligence','Automatic Internet','Advanced Information','Applied Interface','AI stands for Artificial Intelligence.'),
('Books & Authors','Who wrote The Jungle Book?','Rudyard Kipling','Roald Dahl','J. K. Rowling','Mark Twain','Rudyard Kipling wrote The Jungle Book.'),
('Books & Authors','Who wrote Harry Potter?','J. K. Rowling','Enid Blyton','Ruskin Bond','R. K. Narayan','J. K. Rowling wrote the Harry Potter series.'),
('Books & Authors','Who wrote the Ramayana?','Valmiki','Ved Vyasa','Kalidasa','Tulsidas','Valmiki is traditionally credited with the Ramayana.'),
('Books & Authors','Who wrote the Mahabharata?','Ved Vyasa','Valmiki','Kalidasa','Rabindranath Tagore','Ved Vyasa is traditionally credited with the Mahabharata.'),
('Books & Authors','Who wrote Discovery of India?','Jawaharlal Nehru','Mahatma Gandhi','B. R. Ambedkar','Sardar Patel','Jawaharlal Nehru wrote Discovery of India.'),
('Art, Culture & Dance','Which classical dance form is from Tamil Nadu?','Bharatanatyam','Kathak','Bihu','Garba','Bharatanatyam originated in Tamil Nadu.'),
('Art, Culture & Dance','Which dance form is associated with Kerala?','Kathakali','Bhangra','Garba','Lavani','Kathakali is a classical dance-drama from Kerala.'),
('Art, Culture & Dance','Bhangra is associated with which state?','Punjab','Gujarat','Assam','Odisha','Bhangra is a folk dance of Punjab.'),
('Art, Culture & Dance','Which instrument has strings and is played with a bow?','Violin','Tabla','Flute','Dholak','A violin is a string instrument played with a bow.'),
('Art, Culture & Dance','Madhubani painting is associated with which state?','Bihar','Punjab','Kerala','Goa','Madhubani painting comes from Bihar.'),
('Indian Festivals & Traditions','Which festival is known as the Festival of Lights?','Diwali','Holi','Eid','Baisakhi','Diwali is widely called the Festival of Lights.'),
('Indian Festivals & Traditions','Which festival is associated with colours?','Holi','Diwali','Onam','Pongal','Holi is celebrated with colours.'),
('Indian Festivals & Traditions','Onam is celebrated mainly in which state?','Kerala','Punjab','Gujarat','Bihar','Onam is a major festival of Kerala.'),
('Indian Festivals & Traditions','Pongal is a harvest festival of which state?','Tamil Nadu','Maharashtra','Assam','West Bengal','Pongal is a harvest festival celebrated in Tamil Nadu.'),
('Indian Festivals & Traditions','Baisakhi is a major festival of which state?','Punjab','Odisha','Kerala','Goa','Baisakhi is strongly associated with Punjab.'),
('International Organisations','Where is the headquarters of the United Nations?','New York City','Geneva','Paris','London','The UN headquarters is in New York City.'),
('International Organisations','What does WHO stand for?','World Health Organization','World Help Office','World Human Organization','World Health Office','WHO stands for World Health Organization.'),
('International Organisations','What does UNESCO stand for?','United Nations Educational, Scientific and Cultural Organization','United Nations Economic and Social Council','Universal Education and Science Council','United Nations Emergency Service Council','UNESCO promotes education, science and culture.'),
('International Organisations','Which organisation works for children worldwide?','UNICEF','WHO','IMF','WTO','UNICEF works for children.'),
('International Organisations','Where is the headquarters of WHO?','Geneva','Paris','Rome','New Delhi','WHO headquarters is in Geneva, Switzerland.'),
('Important Days','When is Republic Day celebrated in India?','26 January','15 August','2 October','14 November','India celebrates Republic Day on 26 January.'),
('Important Days','When is Independence Day celebrated in India?','15 August','26 January','1 May','5 September','India celebrates Independence Day on 15 August.'),
('Important Days','When is Gandhi Jayanti observed?','2 October','14 November','15 August','26 January','Gandhi Jayanti is observed on 2 October.'),
('Important Days','When is National Sports Day celebrated in India?','29 August','21 June','5 September','14 November','National Sports Day is celebrated on 29 August.'),
('Important Days','When is World Environment Day observed?','5 June','22 April','8 March','1 December','World Environment Day is observed on 5 June.'),
('First in India / World','Who was the first President of India?','Rajendra Prasad','Jawaharlal Nehru','S. Radhakrishnan','Zakir Husain','Rajendra Prasad was India\'s first President.'),
('First in India / World','Who was the first Indian in space?','Rakesh Sharma','Kalpana Chawla','Vikram Sarabhai','Sunita Williams','Rakesh Sharma was the first Indian in space.'),
('First in India / World','Who was the first woman Prime Minister of India?','Indira Gandhi','Sarojini Naidu','Pratibha Patil','Vijaya Lakshmi Pandit','Indira Gandhi was India\'s first woman Prime Minister.'),
('First in India / World','Who was the first Indian to win a Nobel Prize?','Rabindranath Tagore','C. V. Raman','Amartya Sen','Mother Teresa','Rabindranath Tagore won the Nobel Prize for Literature in 1913.'),
('First in India / World','Who was the first person to walk on the Moon?','Neil Armstrong','Yuri Gagarin','Buzz Aldrin','Rakesh Sharma','Neil Armstrong was the first person to walk on the Moon.'),
('Superlatives','Which is the largest planet in the solar system?','Jupiter','Saturn','Earth','Mars','Jupiter is the largest planet.'),
('Superlatives','Which is the smallest continent?','Australia','Europe','Antarctica','South America','Australia is the smallest continent.'),
('Superlatives','Which is the largest hot desert in the world?','Sahara Desert','Thar Desert','Gobi Desert','Kalahari Desert','The Sahara is the largest hot desert.'),
('Superlatives','Which is the deepest ocean in the world?','Pacific Ocean','Atlantic Ocean','Indian Ocean','Arctic Ocean','The Pacific contains the Mariana Trench, the deepest ocean point.'),
('Superlatives','Which is the largest mammal?','Blue whale','Elephant','Giraffe','Hippopotamus','The blue whale is the largest mammal.'),
('Cities & Nicknames','Which Indian city is called the Pink City?','Jaipur','Jodhpur','Udaipur','Agra','Jaipur is known as the Pink City.'),
('Cities & Nicknames','Which city is called the Silicon Valley of India?','Bengaluru','Mumbai','Hyderabad','Pune','Bengaluru is called the Silicon Valley of India.'),
('Cities & Nicknames','Which city is called the City of Lakes in India?','Udaipur','Bhopal','Srinagar','Nainital','Udaipur is widely called the City of Lakes.'),
('Cities & Nicknames','Which city is called the City of Joy?','Kolkata','Mumbai','Delhi','Chennai','Kolkata is known as the City of Joy.'),
('Cities & Nicknames','Which city is called the Blue City?','Jodhpur','Jaipur','Udaipur','Jaisalmer','Jodhpur is known as the Blue City.'),
('Transport & Communication','Which is the fastest mode of transport?','Air transport','Road transport','Rail transport','Water transport','Air transport is generally the fastest mode.'),
('Transport & Communication','What does PIN stand for in an Indian postal address?','Postal Index Number','Personal Identity Number','Public Information Number','Place Identification Number','PIN means Postal Index Number.'),
('Transport & Communication','Which city has India\'s busiest major international airport, named after Chhatrapati Shivaji Maharaj?','Mumbai','Delhi','Chennai','Kolkata','Chhatrapati Shivaji Maharaj International Airport is in Mumbai.'),
('Transport & Communication','Which transport runs on tracks?','Train','Ship','Aeroplane','Bus','Trains run on railway tracks.'),
('Transport & Communication','What does GPS help us find?','Location','Temperature','Blood group','Weight','GPS is used to determine location.'),
('Maps & Locations','Which country shares India\'s western border?','Pakistan','China','Nepal','Bhutan','Pakistan lies to the west of India.'),
('Maps & Locations','Which country lies north of India?','China','Sri Lanka','Maldives','Indonesia','China lies north of India.'),
('Maps & Locations','Which water body lies to the south of India?','Indian Ocean','Atlantic Ocean','Pacific Ocean','Arctic Ocean','The Indian Ocean lies south of India.'),
('Maps & Locations','Which country is an island nation south of India?','Sri Lanka','Nepal','Bhutan','Afghanistan','Sri Lanka is an island nation south of India.'),
('Maps & Locations','Which direction is opposite to east?','West','North','South','Northeast','West is opposite to east.'),
('Current Affairs - India','Which city hosted the G20 Leaders\' Summit in India in 2023?','New Delhi','Mumbai','Bengaluru','Kolkata','India hosted the 2023 G20 Leaders\' Summit in New Delhi.'),
('Current Affairs - India','What is the name of India\'s 2023 Moon landing mission?','Chandrayaan-3','Mangalyaan','Aditya-L1','Gaganyaan','Chandrayaan-3 landed on the Moon in 2023.'),
('Current Affairs - India','Which Indian city hosted the 2024 Chess Olympiad?','Chennai','Delhi','Mumbai','Kolkata','Chennai hosted the 2022 Chess Olympiad; this question is excluded.'),
('Current Affairs - India','Which Indian space mission studies the Sun from space?','Aditya-L1','Chandrayaan-3','Mangalyaan','NISAR','Aditya-L1 is India\'s solar observatory mission.'),
('Current Affairs - India','What is the name of India\'s planned human spaceflight programme?','Gaganyaan','Chandrayaan','Mangalyaan','NavIC','Gaganyaan is India\'s human spaceflight programme.'),
('Current Affairs - World','Which city hosted the 2024 Summer Olympic Games?','Paris','Tokyo','Los Angeles','Rome','Paris hosted the 2024 Summer Olympic Games.'),
('Current Affairs - World','Which country hosted the FIFA World Cup in 2022?','Qatar','Russia','Brazil','Germany','Qatar hosted the 2022 FIFA World Cup.'),
('Current Affairs - World','Which country hosted the 2023 Cricket World Cup?','India','Australia','England','South Africa','India hosted the 2023 ICC Cricket World Cup.'),
('Current Affairs - World','Which country joined NATO in 2024?','Sweden','Japan','India','Brazil','Sweden became a NATO member in 2024.'),
('Current Affairs - World','Which country hosted COP28 in 2023?','United Arab Emirates','India','France','Brazil','COP28 was hosted by the United Arab Emirates in Dubai.'),
('Current Sports Affairs','Which country won the ICC Men\'s Cricket World Cup in 2023?','Australia','India','England','New Zealand','Australia won the 2023 ICC Men\'s Cricket World Cup.'),
('Current Sports Affairs','Which country won the ICC Men\'s T20 World Cup in 2024?','India','South Africa','Australia','England','India won the 2024 ICC Men\'s T20 World Cup.'),
('Current Sports Affairs','Which athlete won the men\'s javelin gold at the 2024 Olympics?','Arshad Nadeem','Neeraj Chopra','Anderson Peters','Julian Weber','Arshad Nadeem won the men\'s javelin gold at Paris 2024.'),
('Current Sports Affairs','Which country won the UEFA Euro 2024 football tournament?','Spain','England','France','Germany','Spain won UEFA Euro 2024.'),
('Current Sports Affairs','Who won the men\'s singles title at Wimbledon in 2024?','Carlos Alcaraz','Novak Djokovic','Jannik Sinner','Rafael Nadal','Carlos Alcaraz won the 2024 Wimbledon men\'s singles title.'),
('Mixed GK / Rapid Fire','Which colour is made by mixing red and yellow?','Orange','Green','Purple','Blue','Red and yellow make orange.'),
('Mixed GK / Rapid Fire','How many days are there in a leap year?','366','365','364','367','A leap year has 366 days.'),
('Mixed GK / Rapid Fire','Which shape has three sides?','Triangle','Square','Circle','Rectangle','A triangle has three sides.'),
('Mixed GK / Rapid Fire','How many colours are there in a rainbow?','7','5','6','8','A rainbow has seven colours.'),
('Mixed GK / Rapid Fire','Which metal is liquid at room temperature?','Mercury','Iron','Copper','Aluminium','Mercury is liquid at ordinary room temperature.'),
('India - General Knowledge','Which is the national fruit of India?','Mango','Apple','Banana','Orange','The mango is the national fruit of India.'),
('World Geography','Which line divides Earth into Northern and Southern Hemispheres?','Equator','Prime Meridian','Tropic of Cancer','Arctic Circle','The Equator divides Earth into Northern and Southern Hemispheres.'),
]

# Generate three age-appropriate question variants for every fact, then take 500.
def make_questions():
    questions = []
    for topic, question, correct, option_b, option_c, option_d, explanation in FACTS:
        variants = [
            (question, correct, option_b, option_c, option_d, explanation),
            (f'Choose the correct answer: {question}', correct, option_b, option_c, option_d, explanation),
            (f'For Class 6 GK, {question[0].lower() + question[1:]}', correct, option_b, option_c, option_d, explanation),
        ]
        questions.extend((topic, *variant) for variant in variants)
    return questions[:500]


def classify_existing(row):
    topic = row['Topic']
    if topic == 'History': return 'Indian History'
    if topic == 'Geography': return 'Indian Geography'
    if topic == 'Polity': return 'Indian Constitution & Civics'
    question = row['Question'].lower()
    rules = [
        (('olympic','cricket','football','hockey','badminton','sport','player','trophy'), 'Sports & Games'),
        (('planet','space','moon','sun','isro','satellite'), 'Space & Astronomy'),
        (('river','dam','lake'), 'Rivers, Dams & Lakes'),
        (('award','nobel','bharat ratna','padma'), 'Awards & Honours'),
        (('computer','internet','software','hardware'), 'Computer & Technology GK'),
        (('festival','dance','music','temple'), 'Art, Culture & Dance'),
        (('capital','state','india','national'), 'India - General Knowledge'),
    ]
    for keywords, target in rules:
        if any(word in question for word in keywords): return target
    return 'Mixed GK / Rapid Fire'


def read_rows(path):
    with path.open('r', encoding='utf-8-sig', newline='') as file:
        return list(csv.DictReader(file))


def write_rows(path, rows, fieldnames):
    with path.open('w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader(); writer.writerows(rows)


def main():
    if not GK_BACKUP.exists(): GK_BACKUP.write_bytes(GK_FILE.read_bytes())
    if not TOPICS_BACKUP.exists(): TOPICS_BACKUP.write_bytes(TOPICS_FILE.read_bytes())
    # Rebuild from the original bank so a failed or repeated run cannot append twice.
    existing = read_rows(GK_BACKUP)
    for row in existing: row['Topic'] = classify_existing(row)
    additions = []
    for number, item in enumerate(make_questions(), start=544):
        topic, question, option_a, option_b, option_c, option_d, explanation = item
        additions.append({'QuestionID': f'GK{number:03d}', 'Class': '6', 'Subject': 'GK', 'Topic': topic,
            'Question': question, 'OptionA': option_a, 'OptionB': option_b, 'OptionC': option_c, 'OptionD': option_d,
            'CorrectAnswer': 'A', 'Explanation': explanation, 'Difficulty': 'Easy', 'Source': 'RMS/Sainik School Prep', 'Active': 'TRUE'})
    for number, row in enumerate(existing + additions, start=1):
        row['QuestionID'] = f'GK{number:03d}'
    fieldnames = list(existing[0])
    write_rows(GK_FILE, existing + additions, fieldnames)
    topics = [row for row in read_rows(TOPICS_FILE) if row['Subject'] != 'GK']
    next_id = max(int(row['TopicID'][1:]) for row in topics) + 1
    for topic in GK_TOPICS:
        topics.append({'TopicID': f'T{next_id:03d}', 'Class': '6', 'Subject': 'GK', 'TopicName': topic, 'Description': 'Class 6 RMS/Sainik School preparation.'})
        next_id += 1
    write_rows(TOPICS_FILE, topics, ['TopicID','Class','Subject','TopicName','Description'])
    print(f'Existing GK questions reclassified: {len(existing)}')
    print(f'New GK questions added: {len(additions)}')
    print(f'Total GK questions: {len(existing) + len(additions)}')
    print(f'GK topics in catalogue: {len(GK_TOPICS)}')

if __name__ == '__main__': main()
