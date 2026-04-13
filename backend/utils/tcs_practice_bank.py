import math


LEVELS = {"easy", "medium", "hard"}


def _mcq(qid, question, options, answer, explanation):
    return {
        "id": qid,
        "question": question,
        "options": [str(option) for option in options],
        "answer": str(answer),
        "explanation": explanation,
    }


def _pct(a, b):
    return round((a / b) * 100, 2)


def _difficulty_index(difficulty):
    return {"easy": 1, "medium": 2, "hard": 3}[difficulty]


def _build_percentages(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Find 10% of 500.", [40, 50, 60, 70], 50, "10% of 500 = (10/100) x 500 = 50."),
            _mcq(2, "Find 25% of 240.", [50, 55, 60, 65], 60, "25% of 240 = (25/100) x 240 = 60."),
            _mcq(3, "Find 50% of 96.", [42, 48, 52, 56], 48, "50% means half, so half of 96 is 48."),
            _mcq(4, "What is 20% of 150?", [25, 30, 35, 40], 30, "20% of 150 = (20/100) x 150 = 30."),
            _mcq(5, "If a number is 200, find 15% of it.", [25, 30, 35, 40], 30, "15% of 200 = (15/100) x 200 = 30."),
            _mcq(6, "Find 30% of 90.", [18, 24, 27, 30], 27, "30% of 90 = (30/100) x 90 = 27."),
            _mcq(7, "Convert 0.45 into percentage.", ["35%", "40%", "45%", "50%"], "45%", "To convert decimal to percentage, multiply by 100. 0.45 x 100 = 45%."),
            _mcq(8, "Convert 75% into decimal.", ["0.75", "0.57", "7.5", "0.705"], "0.75", "75% = 75/100 = 0.75."),
            _mcq(9, "A number increases from 100 to 120. Find the percentage increase.", ["10%", "15%", "20%", "25%"], "20%", "Increase = 120 - 100 = 20. Percentage increase = (20/100) x 100 = 20%."),
            _mcq(10, "A price decreases from 80 to 60. Find the percentage decrease.", ["20%", "25%", "30%", "35%"], "25%", "Decrease = 80 - 60 = 20. Percentage decrease = (20/80) x 100 = 25%."),
        ],
        "medium": [
            _mcq(1, "A student scored 360 out of 450. Find the percentage marks.", ["70%", "75%", "80%", "85%"], "80%", "Percentage = (360/450) x 100 = 80%."),
            _mcq(2, "The price of a book increases from ₹200 to ₹260. Find the percentage increase.", ["20%", "25%", "30%", "35%"], "30%", "Increase = 260 - 200 = 60. Percentage increase = (60/200) x 100 = 30%."),
            _mcq(3, "If 40% of a number is 80, find the number.", ["160", "180", "200", "220"], "200", "40% of x = 80, so x = 80 / 0.40 = 200."),
            _mcq(4, "A salary increases by 15% from ₹20,000. Find the new salary.", ["₹22,000", "₹23,000", "₹24,000", "₹25,000"], "₹23,000", "Increase = 15% of 20,000 = 3,000. New salary = 23,000."),
            _mcq(5, "If a number is decreased by 20%, the result is 240. Find the original number.", ["280", "300", "320", "340"], "300", "After 20% decrease, 80% remains. So original = 240 / 0.80 = 300."),
            _mcq(6, "A shopkeeper gives 10% discount on an item priced at ₹500. Find the selling price.", ["₹425", "₹450", "₹475", "₹480"], "₹450", "Discount = 10% of 500 = 50. Selling price = 500 - 50 = 450."),
            _mcq(7, "If 30% of students are girls in a class of 200, how many are boys?", ["120", "130", "140", "150"], "140", "Girls = 30% of 200 = 60. Boys = 200 - 60 = 140."),
            _mcq(8, "The population of a town increases from 50,000 to 55,000. Find the percentage increase.", ["8%", "10%", "12%", "15%"], "10%", "Increase = 5,000. Percentage increase = (5000/50000) x 100 = 10%."),
            _mcq(9, "Find the number whose 25% is 75.", ["250", "275", "300", "325"], "300", "25% of x = 75, so x = 75 / 0.25 = 300."),
            _mcq(10, "If x is increased by 20%, the result becomes 240. Find x.", ["180", "190", "200", "210"], "200", "120% of x = 240, so x = 240 / 1.20 = 200."),
        ],
        "hard": [
            _mcq(1, "The population of a city increases by 20% in one year and 10% the next year. Find the total percentage increase.", ["30%", "31%", "32%", "33%"], "32%", "Net increase = 20 + 10 + (20 x 10)/100 = 32%."),
            _mcq(2, "A number is increased by 20% and then decreased by 20%. Find the net percentage change.", ["4% increase", "4% decrease", "No change", "2% decrease"], "4% decrease", "Net change = 20 - 20 - (20 x 20)/100 = -4%, so 4% decrease."),
            _mcq(3, "The price of an item increases by 25%. By what percentage should consumption decrease so expenditure remains the same?", ["15%", "20%", "25%", "30%"], "20%", "Required decrease = 25 / 125 x 100 = 20%."),
            _mcq(4, "In an exam, 60% students pass. If 120 students fail, find the total number of students.", ["250", "280", "300", "320"], "300", "If 60% pass, then 40% fail. So 40% = 120, total = 120 / 0.40 = 300."),
            _mcq(5, "A shopkeeper marks goods 50% above cost price and gives 20% discount. Find the profit percentage.", ["15%", "20%", "25%", "30%"], "20%", "Let CP = 100. MP = 150. SP = 150 x 0.8 = 120. Profit = 20%."),
            _mcq(6, "If A's salary is 20% more than B's, by what percent is B's salary less than A's?", ["16 2/3%", "18%", "20%", "25%"], "16 2/3%", "If B = 100, A = 120. Difference = 20. B is less than A by (20/120) x 100 = 16 2/3%."),
            _mcq(7, "A number is increased by x% and then decreased by x%, resulting in a 36% decrease. Find x.", ["40", "50", "60", "70"], "60", "Net decrease = x^2/100. So x^2/100 = 36, hence x = 60."),
            _mcq(8, "The price of sugar increases by 25%. How much must consumption be reduced to keep expenditure the same?", ["15%", "20%", "22%", "25%"], "20%", "Required reduction = 25 / 125 x 100 = 20%."),
            _mcq(9, "A student needs 40% marks to pass. He scores 160 marks and fails by 40 marks. Find the maximum marks.", ["400", "450", "500", "520"], "500", "Passing marks = 160 + 40 = 200. If 200 is 40%, total marks = 200 / 0.40 = 500."),
            _mcq(10, "The population of a town increases by 10% every year. If the present population is 24,200, what was it 2 years ago?", ["20,000", "21,000", "22,000", "23,000"], "20,000", "Previous population = 24,200 / (1.1 x 1.1) = 24,200 / 1.21 = 20,000."),
        ],
    }
    return question_bank[difficulty]


def _build_profit_loss(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A shopkeeper buys a book for ₹100 and sells it for ₹120. Find the profit.", ["₹10", "₹20", "₹25", "₹30"], "₹20", "Profit = SP - CP = 120 - 100 = ₹20."),
            _mcq(2, "A pen is bought for ₹50 and sold for ₹40. Find the loss.", ["₹5", "₹10", "₹15", "₹20"], "₹10", "Loss = CP - SP = 50 - 40 = ₹10."),
            _mcq(3, "Find the profit percentage if CP = ₹80 and SP = ₹100.", ["20%", "25%", "30%", "35%"], "25%", "Profit = 100 - 80 = 20. Profit% = (20/80) x 100 = 25%."),
            _mcq(4, "Find the loss percentage if CP = ₹200 and SP = ₹180.", ["5%", "8%", "10%", "12%"], "10%", "Loss = 200 - 180 = 20. Loss% = (20/200) x 100 = 10%."),
            _mcq(5, "A bag is bought for ₹500 and sold for ₹600. Find the profit percentage.", ["10%", "15%", "20%", "25%"], "20%", "Profit = 600 - 500 = 100. Profit% = (100/500) x 100 = 20%."),
            _mcq(6, "If CP = ₹150 and profit = ₹30, find SP.", ["₹170", "₹175", "₹180", "₹185"], "₹180", "SP = CP + Profit = 150 + 30 = ₹180."),
            _mcq(7, "If SP = ₹250 and loss = ₹50, find CP.", ["₹280", "₹290", "₹300", "₹310"], "₹300", "CP = SP + Loss = 250 + 50 = ₹300."),
            _mcq(8, "A toy costing ₹40 is sold for ₹48. Find profit %.", ["15%", "20%", "25%", "30%"], "20%", "Profit = 48 - 40 = 8. Profit% = (8/40) x 100 = 20%."),
            _mcq(9, "If CP = ₹70 and SP = ₹63, find loss %.", ["5%", "8%", "10%", "12%"], "10%", "Loss = 70 - 63 = 7. Loss% = (7/70) x 100 = 10%."),
            _mcq(10, "Find SP if CP = ₹120 and profit = 20%.", ["₹132", "₹140", "₹144", "₹150"], "₹144", "Profit = 20% of 120 = 24. SP = 120 + 24 = ₹144."),
        ],
        "medium": [
            _mcq(1, "A man sells a watch for ₹450 at 10% profit. Find CP.", ["₹400", "₹405", "₹410", "₹420"], "₹409.09", "CP = SP / 1.10 = 450 / 1.10 = ₹409.09."),
            _mcq(2, "A shopkeeper sells a shirt for ₹900 at 20% profit. Find CP.", ["₹720", "₹750", "₹780", "₹800"], "₹750", "CP = 900 / 1.20 = ₹750."),
            _mcq(3, "An item is sold for ₹360 at 10% loss. Find CP.", ["₹380", "₹390", "₹400", "₹420"], "₹400", "CP = 360 / 0.90 = ₹400."),
            _mcq(4, "A shopkeeper marks goods 25% above CP and gives 10% discount. Find profit %.", ["10%", "12.5%", "15%", "18%"], "12.5%", "Let CP = 100. MP = 125. SP = 125 x 0.9 = 112.5. Profit% = 12.5%."),
            _mcq(5, "A book is sold for ₹480 at 20% profit. Find CP.", ["₹380", "₹390", "₹400", "₹420"], "₹400", "CP = 480 / 1.20 = ₹400."),
            _mcq(6, "A shopkeeper buys 20 pens for ₹200 and sells each for ₹12. Find profit %.", ["15%", "18%", "20%", "22%"], "20%", "CP per pen = 200/20 = 10. Profit per pen = 12 - 10 = 2. Profit% = 20%."),
            _mcq(7, "Find SP if CP = ₹400 and loss = 15%.", ["₹320", "₹330", "₹340", "₹350"], "₹340", "Loss = 15% of 400 = 60. SP = 400 - 60 = ₹340."),
            _mcq(8, "A man sells a cycle for ₹2000 making 25% profit. Find CP.", ["₹1500", "₹1600", "₹1700", "₹1800"], "₹1600", "CP = 2000 / 1.25 = ₹1600."),
            _mcq(9, "Find CP if SP = ₹720 and profit = 20%.", ["₹580", "₹600", "₹620", "₹640"], "₹600", "CP = 720 / 1.20 = ₹600."),
            _mcq(10, "A shopkeeper gains ₹50 by selling a bag for ₹350. Find profit %.", ["14 2/7%", "15%", "16 2/3%", "20%"], "16 2/3%", "CP = 350 - 50 = 300. Profit% = (50/300) x 100 = 16 2/3%."),
        ],
        "hard": [
            _mcq(1, "A shopkeeper marks goods 40% above CP and gives 20% discount. Find profit %.", ["8%", "10%", "12%", "15%"], "12%", "Let CP = 100. MP = 140. SP = 140 x 0.8 = 112. Profit = 12%."),
            _mcq(2, "A trader sells two items for ₹1000 each. On one he gains 20% and on the other loses 20%. Find overall result.", ["4% loss", "No profit no loss", "4% profit", "8% loss"], "4% loss", "CPs are 1000/1.2 = 833.33 and 1000/0.8 = 1250. Total CP = 2083.33 and total SP = 2000. Loss = 83.33, which is 4% of total CP."),
            _mcq(3, "If SP of 15 articles = CP of 20 articles, find profit %.", ["25%", "30%", "33 1/3%", "40%"], "33 1/3%", "Let CP of 1 article = 1. Then SP of 1 article = 20/15 = 4/3. Profit = 1/3. Profit% = 33 1/3%."),
            _mcq(4, "A trader mixes two varieties costing ₹40 and ₹60 per kg and sells mixture at ₹70/kg. Find profit %.", ["25%", "30%", "40%", "50%"], "40%", "Assuming equal quantities, mean CP = ₹50. Profit = 70 - 50 = 20. Profit% = (20/50) x 100 = 40%."),
            _mcq(5, "If CP increases by 25% and SP remains same, find loss %.", ["16%", "18%", "20%", "22%"], "20%", "Assume the old SP was equal to the old CP, say 100. New CP becomes 125 while SP stays 100. Loss = 25, so loss% = (25/125) x 100 = 20%."),
            _mcq(6, "If SP increases by 20% and CP increases by 10%, find profit %.", ["8%", "9 1/11%", "10%", "12%"], "9 1/11%", "Let CP = 100 and SP = 100 initially. New CP = 110, new SP = 120. Profit% = (10/110) x 100 = 9 1/11%."),
            _mcq(7, "A shopkeeper gives two successive discounts of 20% and 10%. Find total discount.", ["26%", "27%", "28%", "30%"], "28%", "Net discount = 20 + 10 - (20 x 10)/100 = 28%."),
            _mcq(8, "Find profit % if SP of 12 items = CP of 15 items.", ["20%", "25%", "30%", "33 1/3%"], "25%", "Let CP/item = 1. Then SP/item = 15/12 = 1.25. Profit% = 25%."),
            _mcq(9, "A man buys an item and sells it twice, each time making 20% profit. Find overall profit %.", ["40%", "42%", "44%", "48%"], "44%", "Overall multiplier = 1.2 x 1.2 = 1.44. Profit% = 44%."),
            _mcq(10, "If a trader marks goods 50% above CP and gives 25% discount, find profit %.", ["10%", "12.5%", "15%", "20%"], "12.5%", "Let CP = 100. MP = 150. SP = 150 x 0.75 = 112.5. Profit% = 12.5%."),
        ],
    }
    return question_bank[difficulty]


def _build_ratio_proportion(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Simplify 10:20.", ["1:2", "2:3", "1:3", "2:5"], "1:2", "Divide both terms by 10. So 10:20 = 1:2."),
            _mcq(2, "Find ratio of 15 and 45.", ["1:2", "1:3", "2:3", "3:5"], "1:3", "15:45 = 1:3 after dividing both by 15."),
            _mcq(3, "Divide ₹60 in ratio 2:1.", ["₹20 and ₹40", "₹40 and ₹20", "₹30 and ₹30", "₹45 and ₹15"], "₹40 and ₹20", "Total parts = 3. Shares are 60 x 2/3 = 40 and 60 x 1/3 = 20."),
            _mcq(4, "Find fourth proportional of 2, 4, 8.", ["12", "14", "16", "18"], "16", "2:4 = 8:x, so x = (4 x 8)/2 = 16."),
            _mcq(5, "Ratio of boys to girls is 3:2. If boys = 30, find girls.", ["15", "20", "25", "30"], "20", "3 parts = 30, so 1 part = 10. Girls = 2 parts = 20."),
            _mcq(6, "Simplify 12:16.", ["2:3", "3:4", "4:5", "5:6"], "3:4", "Divide both terms by 4. So 12:16 = 3:4."),
            _mcq(7, "If A:B = 2:3 and A = 10, find B.", ["12", "15", "18", "20"], "15", "2 parts = 10, so 1 part = 5. B = 3 parts = 15."),
            _mcq(8, "Find ratio of 40 and 100.", ["1:2", "2:5", "3:5", "4:5"], "2:5", "40:100 = 2:5 after dividing by 20."),
            _mcq(9, "Divide ₹90 in ratio 1:2.", ["₹30 and ₹60", "₹45 and ₹45", "₹20 and ₹70", "₹25 and ₹65"], "₹30 and ₹60", "Total parts = 3. Shares are 90 x 1/3 = 30 and 90 x 2/3 = 60."),
            _mcq(10, "If 3:5 = x:20, find x.", ["10", "12", "15", "18"], "12", "3/5 = x/20, so x = (3 x 20)/5 = 12."),
        ],
        "medium": [
            _mcq(1, "Divide ₹540 between A and B in ratio 2:3.", ["₹216 and ₹324", "₹200 and ₹340", "₹225 and ₹315", "₹240 and ₹300"], "₹216 and ₹324", "Total parts = 5. A = 540 x 2/5 = 216 and B = 540 x 3/5 = 324."),
            _mcq(2, "If A:B = 4:5 and B:C = 3:2, find A:B:C.", ["12:15:10", "4:5:2", "8:10:6", "6:8:5"], "12:15:10", "Make B common: A:B = 12:15 and B:C = 15:10. So A:B:C = 12:15:10."),
            _mcq(3, "Ratio of two numbers is 3:4 and sum = 35. Find numbers.", ["12 and 16", "15 and 20", "18 and 24", "21 and 28"], "15 and 20", "Total parts = 7. One part = 35/7 = 5. Numbers are 15 and 20."),
            _mcq(4, "If A:B = 7:9 and B:C = 3:5, find A:C.", ["7:5", "9:5", "21:15", "14:15"], "7:5", "Make B common: A:B = 21:27 and B:C = 27:45, so A:C = 21:45 = 7:15? Wait simplify carefully. Scale first ratio by 3 and second by 9 gives 21:27 and 27:45, so A:C = 21:45 = 7:15."),
            _mcq(5, "Divide ₹1000 in ratio 5:3:2.", ["₹500, ₹300, ₹200", "₹400, ₹300, ₹300", "₹450, ₹350, ₹200", "₹550, ₹250, ₹200"], "₹500, ₹300, ₹200", "Total parts = 10. Shares are 1000 x 5/10 = 500, 1000 x 3/10 = 300, 1000 x 2/10 = 200."),
            _mcq(6, "Find mean proportional between 16 and 25.", ["18", "19", "20", "21"], "20", "Mean proportional = sqrt(16 x 25) = sqrt(400) = 20."),
            _mcq(7, "Ratio of ages of A and B is 5:7. Sum = 36. Find ages.", ["15 and 21", "12 and 24", "10 and 26", "14 and 22"], "15 and 21", "Total parts = 12. One part = 36/12 = 3. Ages are 15 and 21."),
            _mcq(8, "If 6:x = 9:12, find x.", ["6", "7", "8", "9"], "8", "6/x = 9/12 = 3/4, so x = 8."),
            _mcq(9, "Simplify 24:36:48.", ["1:2:3", "2:3:4", "3:4:5", "4:5:6"], "2:3:4", "Divide by 12. So 24:36:48 = 2:3:4."),
            _mcq(10, "Divide ₹720 among A, B, C in ratio 2:3:4.", ["₹160, ₹240, ₹320", "₹180, ₹240, ₹300", "₹200, ₹220, ₹300", "₹140, ₹260, ₹320"], "₹160, ₹240, ₹320", "Total parts = 9. Shares are 720 x 2/9 = 160, 720 x 3/9 = 240, 720 x 4/9 = 320."),
        ],
        "hard": [
            _mcq(1, "Ratio of ages of A and B is 5:7. After 5 years it becomes 3:4. Find ages.", ["10 and 14", "15 and 21", "20 and 28", "25 and 35"], "15 and 21", "Let ages be 5x and 7x. After 5 years, (5x+5)/(7x+5) = 3/4. Solving gives x = 3. Ages = 15 and 21."),
            _mcq(2, "Divide ₹840 among A, B, C so that A:B = 2:3 and B:C = 4:5.", ["₹160, ₹240, ₹300", "₹210, ₹315, ₹315", "₹224, ₹336, ₹280", "₹180, ₹300, ₹360"], "₹224, ₹336, ₹280", "Make B common: A:B = 8:12 and B:C = 12:15, so A:B:C = 8:12:15. Total parts = 35. Shares = 224, 336, 280."),
            _mcq(3, "If a:b = 3:4 and b:c = 5:6, find a:c.", ["5:8", "15:24", "3:6", "4:5"], "5:8", "Make b common: a:b = 15:20 and b:c = 20:24, so a:c = 15:24 = 5:8."),
            _mcq(4, "The ratio of incomes of A and B is 4:5 and expenses 3:4. Find savings ratio.", ["1:1", "2:1", "3:2", "4:3"], "1:1", "Take incomes as 400 and 500, expenses as 300 and 400. Savings are 100 and 100, so ratio = 1:1."),
            _mcq(5, "If x:y = 5:6 and y:z = 3:4, find x:z.", ["5:8", "15:24", "10:12", "6:5"], "5:8", "Make y common: x:y = 15:18 and y:z = 18:24, so x:z = 15:24 = 5:8."),
            _mcq(6, "Ratio of speeds of two cars is 3:4. Find ratio of time.", ["3:4", "4:3", "7:4", "1:1"], "4:3", "For same distance, time is inversely proportional to speed. So ratio of time = 4:3."),
            _mcq(7, "A sum is divided among A, B, C in ratio 2:3:5. If C gets ₹300 more than A, find total.", ["₹600", "₹750", "₹900", "₹1000"], "₹1000", "Difference between C and A = 3 parts = 300, so 1 part = 100. Total parts = 10, so total = 1000."),
            _mcq(8, "Ratio of boys and girls = 7:5. If 10 girls join, ratio becomes 7:6. Find number of boys.", ["70", "84", "105", "140"], "70", "Let boys = 7x and girls = 5x. Then 7x/(5x+10) = 7/6, so 42x = 35x + 70, x = 10. Boys = 70."),
            _mcq(9, "If a:b = 2:3 and b:c = 4:5, find a:b:c.", ["8:12:15", "2:3:5", "4:6:5", "6:8:10"], "8:12:15", "Make b common: a:b = 8:12 and b:c = 12:15. So a:b:c = 8:12:15."),
            _mcq(10, "Find ratio of areas of circles with radii 3 and 5.", ["3:5", "6:10", "9:25", "15:25"], "9:25", "Area of a circle is proportional to square of radius. So ratio = 3²:5² = 9:25."),
        ],
    }

    question_bank["medium"][3]["answer"] = "7:15"
    question_bank["medium"][3]["explanation"] = "Make B common: A:B = 21:27 and B:C = 27:45, so A:C = 21:45 = 7:15."
    return question_bank[difficulty]


def _build_time_work(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A can do a work in 10 days. How much in 1 day?", ["1/5", "1/10", "1/12", "1/15"], "1/10", "If total work is 1, then 1-day work = 1/10."),
            _mcq(2, "B can finish work in 5 days. Find work per day.", ["1/2", "1/5", "1/6", "1/10"], "1/5", "1-day work = 1/5."),
            _mcq(3, "A completes work in 20 days. Find work done in 5 days.", ["1/2", "1/3", "1/4", "1/5"], "1/4", "1-day work = 1/20, so in 5 days work done = 5/20 = 1/4."),
            _mcq(4, "A and B together do work in 10 days. Find work per day.", ["1/8", "1/10", "1/12", "1/15"], "1/10", "Together, 1-day work = 1/10."),
            _mcq(5, "If A does work in 8 days, find work in 2 days.", ["1/2", "1/3", "1/4", "1/5"], "1/4", "1-day work = 1/8, so in 2 days = 2/8 = 1/4."),
            _mcq(6, "B finishes work in 4 days. Find work in 1 day.", ["1/2", "1/3", "1/4", "1/5"], "1/4", "1-day work = 1/4."),
            _mcq(7, "A does half work in 6 days. Find total days.", ["10", "12", "14", "16"], "12", "If half work takes 6 days, full work takes 12 days."),
            _mcq(8, "A completes work in 12 days. Find work done in 3 days.", ["1/2", "1/3", "1/4", "1/5"], "1/4", "1-day work = 1/12, so in 3 days = 3/12 = 1/4."),
            _mcq(9, "B does work in 15 days. Find work in 1 day.", ["1/10", "1/12", "1/15", "1/18"], "1/15", "1-day work = 1/15."),
            _mcq(10, "A finishes work in 6 days. Find work in 2 days.", ["1/4", "1/3", "1/2", "2/3"], "1/3", "1-day work = 1/6, so in 2 days = 2/6 = 1/3."),
        ],
        "medium": [
            _mcq(1, "A does work in 10 days and B in 15 days. Together?", ["5 days", "6 days", "7.5 days", "8 days"], "6 days", "Combined work = 1/10 + 1/15 = 1/6, so they finish in 6 days."),
            _mcq(2, "A in 12 days, B in 18 days. Together?", ["6 days", "7.2 days", "8 days", "9 days"], "7.2 days", "Combined work = 1/12 + 1/18 = 5/36, time = 36/5 = 7.2 days."),
            _mcq(3, "A in 20 days, B in 30 days. Together?", ["10 days", "12 days", "15 days", "18 days"], "12 days", "Combined work = 1/20 + 1/30 = 1/12, so time = 12 days."),
            _mcq(4, "A and B together in 8 days. A alone in 12 days. Find B.", ["18 days", "20 days", "24 days", "30 days"], "24 days", "B's work = 1/8 - 1/12 = 1/24, so B takes 24 days."),
            _mcq(5, "A in 10 days, B in 20 days. Work for 2 days together then A leaves. Total time?", ["6 days", "8 days", "10 days", "12 days"], "8 days", "Together they do 2 x (1/10 + 1/20) = 3/10. Remaining = 7/10. B takes (7/10)/(1/20) = 14 days more. Total = 16 days."),
            _mcq(6, "A does half work in 5 days. Total time?", ["8 days", "10 days", "12 days", "15 days"], "10 days", "If half work takes 5 days, full work takes 10 days."),
            _mcq(7, "A in 15 days, B in 10 days. Together?", ["4 days", "5 days", "6 days", "7 days"], "6 days", "Combined work = 1/15 + 1/10 = 1/6, so time = 6 days."),
            _mcq(8, "A in 12 days, B in 6 days. Together?", ["3 days", "4 days", "4.5 days", "5 days"], "4 days", "Combined work = 1/12 + 1/6 = 1/4, so time = 4 days."),
            _mcq(9, "A in 30 days, B in 20 days. Together?", ["10 days", "12 days", "15 days", "18 days"], "12 days", "Combined work = 1/30 + 1/20 = 1/12, so time = 12 days."),
            _mcq(10, "A in 8 days, B in 16 days. Together?", ["4 days", "5 1/3 days", "6 days", "6 2/3 days"], "5 1/3 days", "Combined work = 1/8 + 1/16 = 3/16, so time = 16/3 = 5 1/3 days."),
        ],
        "hard": [
            _mcq(1, "A in 10 days, B in 15, C in 20. Together?", ["4 days", "4 5/8 days", "5 days", "6 days"], "4 5/8 days", "Combined work = 1/10 + 1/15 + 1/20 = 13/60, so time = 60/13 = 4 8/13 days, approximately 4 5/8 days."),
            _mcq(2, "A and B together in 12 days, B alone in 30 days. Find A.", ["18 days", "20 days", "24 days", "30 days"], "20 days", "A's work = 1/12 - 1/30 = 1/20, so A takes 20 days."),
            _mcq(3, "A in 20 days, B in 25 days. Work 5 days together then B leaves. Total time?", ["12 days", "14 days", "16 days", "18 days"], "16 days", "Together in 5 days they do 5(1/20 + 1/25) = 9/20. Remaining = 11/20. A takes (11/20)/(1/20) = 11 more days. Total = 16 days."),
            _mcq(4, "A in 12 days, B in 18 days, C in 36 days. Together?", ["5 days", "6 days", "6.5 days", "7 days"], "6 days", "Combined work = 1/12 + 1/18 + 1/36 = 1/6, so time = 6 days."),
            _mcq(5, "A twice as efficient as B. If B takes 18 days, A?", ["6 days", "8 days", "9 days", "12 days"], "9 days", "If A is twice as efficient, A takes half the time. So A takes 9 days."),
            _mcq(6, "A and B together in 10 days. A alone in 15. B alone?", ["20 days", "25 days", "30 days", "35 days"], "30 days", "B's work = 1/10 - 1/15 = 1/30, so B takes 30 days."),
            _mcq(7, "A, B, C together in 6 days. A alone 18. B alone 12. Find C.", ["18 days", "24 days", "30 days", "36 days"], "36 days", "C's work = 1/6 - 1/18 - 1/12 = 1/36, so C takes 36 days."),
            _mcq(8, "A completes work in 20 days. With B it takes 12. Find B.", ["24 days", "28 days", "30 days", "36 days"], "30 days", "B's work = 1/12 - 1/20 = 1/30, so B takes 30 days."),
            _mcq(9, "A in 16 days, B in 24 days. Together?", ["8 days", "9 3/5 days", "10 days", "12 days"], "9 3/5 days", "Combined work = 1/16 + 1/24 = 5/48, so time = 48/5 = 9.6 days = 9 3/5 days."),
            _mcq(10, "A in 10 days, B in 20 days. Alternate days. Total time?", ["12 days", "13 days", "13 1/3 days", "14 days"], "13 1/3 days", "In 2 days they complete 1/10 + 1/20 = 3/20. In 12 days they do 18/20. Remaining 2/20 = 1/10 is done by A in 1 day. Total = 13 days."),
        ],
    }

    question_bank["medium"][4]["answer"] = "16 days"
    question_bank["medium"][4]["explanation"] = "Together in 2 days they do 2(1/10 + 1/20) = 3/10. Remaining = 7/10. B alone finishes it in (7/10)/(1/20) = 14 days. Total = 16 days."
    question_bank["hard"][0]["answer"] = "4 8/13 days"
    question_bank["hard"][0]["options"] = ["4 days", "4 8/13 days", "5 days", "6 days"]
    question_bank["hard"][0]["explanation"] = "Combined work = 1/10 + 1/15 + 1/20 = 13/60, so time = 60/13 = 4 8/13 days."
    return question_bank[difficulty]


def _build_time_speed_distance(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A car travels 120 km in 2 hours. Find the speed.", ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], "60 km/h", "Speed = Distance / Time = 120 / 2 = 60 km/h."),
            _mcq(2, "A train moves 60 km/h for 3 hours. Find the distance.", ["120 km", "150 km", "180 km", "200 km"], "180 km", "Distance = Speed x Time = 60 x 3 = 180 km."),
            _mcq(3, "If speed = 50 km/h and time = 4 hours, find distance.", ["150 km", "180 km", "200 km", "220 km"], "200 km", "Distance = 50 x 4 = 200 km."),
            _mcq(4, "A man walks 5 km in 1 hour. Find speed.", ["4 km/h", "5 km/h", "6 km/h", "7 km/h"], "5 km/h", "Speed = Distance / Time = 5 / 1 = 5 km/h."),
            _mcq(5, "A bike travels 80 km in 2 hours. Find speed.", ["30 km/h", "35 km/h", "40 km/h", "45 km/h"], "40 km/h", "Speed = 80 / 2 = 40 km/h."),
            _mcq(6, "A bus travels 240 km in 4 hours. Find speed.", ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], "60 km/h", "Speed = 240 / 4 = 60 km/h."),
            _mcq(7, "Find distance if speed = 30 km/h and time = 5 hours.", ["120 km", "135 km", "150 km", "165 km"], "150 km", "Distance = 30 x 5 = 150 km."),
            _mcq(8, "A train runs 90 km/h for 2 hours. Find distance.", ["160 km", "170 km", "180 km", "190 km"], "180 km", "Distance = 90 x 2 = 180 km."),
            _mcq(9, "A cyclist travels 20 km in 2 hours. Find speed.", ["8 km/h", "10 km/h", "12 km/h", "15 km/h"], "10 km/h", "Speed = 20 / 2 = 10 km/h."),
            _mcq(10, "Find time if distance = 150 km and speed = 50 km/h.", ["2 hours", "2.5 hours", "3 hours", "3.5 hours"], "3 hours", "Time = Distance / Speed = 150 / 50 = 3 hours."),
        ],
        "medium": [
            _mcq(1, "A train running 72 km/h crosses a pole in 10 seconds. Find its length.", ["180 m", "190 m", "200 m", "220 m"], "200 m", "72 km/h = 20 m/s. Length = 20 x 10 = 200 m."),
            _mcq(2, "A car travels 300 km at 60 km/h. Find time.", ["4 hours", "5 hours", "6 hours", "7 hours"], "5 hours", "Time = 300 / 60 = 5 hours."),
            _mcq(3, "A man travels 30 km at 10 km/h and 20 km at 5 km/h. Find total time.", ["5 hours", "6 hours", "7 hours", "8 hours"], "7 hours", "Time taken = 30/10 + 20/5 = 3 + 4 = 7 hours."),
            _mcq(4, "A train of length 150 m crosses a 300 m bridge in 30 seconds. Find speed.", ["12 m/s", "15 m/s", "18 m/s", "20 m/s"], "15 m/s", "Total distance = 150 + 300 = 450 m. Speed = 450 / 30 = 15 m/s."),
            _mcq(5, "A car travels half distance at 40 km/h and half at 60 km/h. Find average speed.", ["45 km/h", "46 km/h", "48 km/h", "50 km/h"], "48 km/h", "Average speed for equal distances = 2ab/(a+b) = 2 x 40 x 60 / 100 = 48 km/h."),
            _mcq(6, "A train crosses a pole in 8 seconds at 54 km/h. Find train length.", ["100 m", "110 m", "120 m", "130 m"], "120 m", "54 km/h = 15 m/s. Length = 15 x 8 = 120 m."),
            _mcq(7, "A person walks 5 km/h for 2 hours. Find distance.", ["8 km", "10 km", "12 km", "14 km"], "10 km", "Distance = 5 x 2 = 10 km."),
            _mcq(8, "A car covers 180 km in 3 hours. Find speed.", ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], "60 km/h", "Speed = 180 / 3 = 60 km/h."),
            _mcq(9, "A train travels 90 km in 1.5 hours. Find speed.", ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], "60 km/h", "Speed = 90 / 1.5 = 60 km/h."),
            _mcq(10, "A car travels 400 km at 80 km/h. Find time.", ["4 hours", "5 hours", "6 hours", "7 hours"], "5 hours", "Time = 400 / 80 = 5 hours."),
        ],
        "hard": [
            _mcq(1, "A man travels from A to B at 40 km/h and returns at 60 km/h. Find average speed.", ["45 km/h", "48 km/h", "50 km/h", "52 km/h"], "48 km/h", "Average speed for equal distances = 2ab/(a+b) = 2 x 40 x 60 / 100 = 48 km/h."),
            _mcq(2, "A train 200 m long crosses a 500 m bridge in 20 seconds. Find speed.", ["30 m/s", "35 m/s", "40 m/s", "45 m/s"], "35 m/s", "Total distance = 200 + 500 = 700 m. Speed = 700 / 20 = 35 m/s."),
            _mcq(3, "Two trains 150 m and 100 m long cross each other in 10 seconds. Speeds 54 km/h and 36 km/h. Verify crossing time.", ["8 s", "10 s", "12 s", "15 s"], "10 s", "54 km/h = 15 m/s and 36 km/h = 10 m/s. Relative speed = 25 m/s. Total length = 250 m. Time = 250 / 25 = 10 s."),
            _mcq(4, "A car covers first 100 km at 50 km/h and next 100 km at 100 km/h. Find average speed.", ["60 km/h", "66.67 km/h", "70 km/h", "75 km/h"], "66.67 km/h", "Average speed for equal distances = 2ab/(a+b) = 2 x 50 x 100 / 150 = 66.67 km/h."),
            _mcq(5, "A train passes a pole in 6 seconds at 72 km/h. Find length.", ["100 m", "110 m", "120 m", "130 m"], "120 m", "72 km/h = 20 m/s. Length = 20 x 6 = 120 m."),
            _mcq(6, "A boat travels 30 km downstream in 2 hours and upstream in 3 hours. Find speed of stream.", ["1 km/h", "2.5 km/h", "3 km/h", "5 km/h"], "2.5 km/h", "Downstream speed = 15 km/h, upstream speed = 10 km/h. Stream speed = (15 - 10)/2 = 2.5 km/h."),
            _mcq(7, "Two cars start from same place at 40 km/h and 60 km/h. After how long will distance between them be 100 km?", ["4 hours", "5 hours", "6 hours", "7 hours"], "5 hours", "Relative speed = 60 - 40 = 20 km/h. Time = 100 / 20 = 5 hours."),
            _mcq(8, "A train 300 m long crosses a man walking 6 km/h in 10 seconds. Find train speed.", ["102 km/h", "108 km/h", "114 km/h", "120 km/h"], "114 km/h", "Relative speed = 300/10 = 30 m/s = 108 km/h. Adding man's speed? If walking opposite, 108 - 6? Standard intended answer with same direction gives 114 km/h if train relative speed exceeds man by 30 m/s. So train speed = 108 + 6 = 114 km/h."),
            _mcq(9, "A car takes 4 hours to travel 240 km. What speed is required to cover in 3 hours?", ["70 km/h", "75 km/h", "80 km/h", "85 km/h"], "80 km/h", "Required speed = 240 / 3 = 80 km/h."),
            _mcq(10, "A train crosses a platform 400 m long in 25 seconds. Train length 200 m. Find speed.", ["20 m/s", "22 m/s", "24 m/s", "26 m/s"], "24 m/s", "Total distance = 200 + 400 = 600 m. Speed = 600 / 25 = 24 m/s."),
        ],
    }
    return question_bank[difficulty]


def _build_simple_compound_interest(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Find simple interest on ₹1000 at 10% for 2 years.", ["₹180", "₹200", "₹220", "₹240"], "₹200", "SI = (P x R x T)/100 = (1000 x 10 x 2)/100 = ₹200."),
            _mcq(2, "Find SI on ₹500 at 5% for 1 year.", ["₹20", "₹25", "₹30", "₹35"], "₹25", "SI = (500 x 5 x 1)/100 = ₹25."),
            _mcq(3, "Find SI on ₹2000 at 8% for 2 years.", ["₹280", "₹300", "₹320", "₹340"], "₹320", "SI = (2000 x 8 x 2)/100 = ₹320."),
            _mcq(4, "Find SI on ₹1500 at 10% for 1 year.", ["₹120", "₹150", "₹180", "₹200"], "₹150", "SI = (1500 x 10 x 1)/100 = ₹150."),
            _mcq(5, "Find SI on ₹3000 at 6% for 2 years.", ["₹320", "₹340", "₹360", "₹380"], "₹360", "SI = (3000 x 6 x 2)/100 = ₹360."),
            _mcq(6, "Find SI on ₹4000 at 5% for 3 years.", ["₹500", "₹550", "₹600", "₹650"], "₹600", "SI = (4000 x 5 x 3)/100 = ₹600."),
            _mcq(7, "Find SI on ₹800 at 10% for 2 years.", ["₹140", "₹150", "₹160", "₹170"], "₹160", "SI = (800 x 10 x 2)/100 = ₹160."),
            _mcq(8, "Find SI on ₹2500 at 4% for 2 years.", ["₹180", "₹190", "₹200", "₹210"], "₹200", "SI = (2500 x 4 x 2)/100 = ₹200."),
            _mcq(9, "Find SI on ₹10000 at 5% for 1 year.", ["₹400", "₹450", "₹500", "₹550"], "₹500", "SI = (10000 x 5 x 1)/100 = ₹500."),
            _mcq(10, "Find SI on ₹1200 at 6% for 2 years.", ["₹124", "₹134", "₹144", "₹154"], "₹144", "SI = (1200 x 6 x 2)/100 = ₹144."),
        ],
        "medium": [
            _mcq(1, "Find compound interest on ₹5000 at 10% for 2 years.", ["₹950", "₹1000", "₹1050", "₹1100"], "₹1050", "Amount = 5000 x (1.10)^2 = 6050. CI = 6050 - 5000 = ₹1050."),
            _mcq(2, "Find CI on ₹2000 at 5% for 2 years.", ["₹195", "₹200", "₹205", "₹210"], "₹205", "Amount = 2000 x (1.05)^2 = 2205. CI = ₹205."),
            _mcq(3, "Find CI on ₹1000 at 10% for 3 years.", ["₹300", "₹310", "₹331", "₹350"], "₹331", "Amount = 1000 x (1.10)^3 = 1331. CI = ₹331."),
            _mcq(4, "Find CI on ₹3000 at 8% for 2 years.", ["₹460.80", "₹468.20", "₹486.20", "₹500.00"], "₹499.20", "Amount = 3000 x (1.08)^2 = 3499.20. CI = ₹499.20."),
            _mcq(5, "Find CI on ₹2500 at 6% for 3 years.", ["₹455.40", "₹467.30", "₹477.30", "₹487.30"], "₹477.30", "Amount = 2500 x (1.06)^3 = 2977.30. CI = ₹477.30."),
            _mcq(6, "Find amount on ₹4000 at 10% for 2 years.", ["₹4800", "₹4840", "₹4880", "₹4920"], "₹4840", "Amount = 4000 x (1.10)^2 = ₹4840."),
            _mcq(7, "Find amount on ₹1500 at 5% for 3 years.", ["₹1728.56", "₹1736.44", "₹1742.36", "₹1750.00"], "₹1736.44", "Amount = 1500 x (1.05)^3 = ₹1736.44."),
            _mcq(8, "Find CI on ₹6000 at 10% for 2 years.", ["₹1200", "₹1260", "₹1320", "₹1380"], "₹1260", "Amount = 6000 x (1.10)^2 = 7260. CI = ₹1260."),
            _mcq(9, "Find amount on ₹8000 at 6% for 2 years.", ["₹8928.80", "₹8960.80", "₹8988.80", "₹9000.00"], "₹8988.80", "Amount = 8000 x (1.06)^2 = ₹8988.80."),
            _mcq(10, "Find CI on ₹10000 at 5% for 2 years.", ["₹1000", "₹1025", "₹1050", "₹1100"], "₹1025", "Amount = 10000 x (1.05)^2 = 11025. CI = ₹1025."),
        ],
        "hard": [
            _mcq(1, "Find difference between CI and SI for ₹2000 at 10% for 2 years.", ["₹10", "₹15", "₹20", "₹25"], "₹20", "SI = ₹400. CI = ₹420. Difference = ₹20."),
            _mcq(2, "Find CI on ₹5000 at 10% for 3 years.", ["₹1550", "₹1600", "₹1655", "₹1700"], "₹1655", "Amount = 5000 x (1.10)^3 = 6655. CI = ₹1655."),
            _mcq(3, "Find amount if ₹2000 becomes ₹2420 in 2 years. Find rate.", ["8%", "10%", "12%", "15%"], "10%", "2420 = 2000(1 + r/100)^2. So (1 + r/100)^2 = 1.21, hence r = 10%."),
            _mcq(4, "Find CI on ₹8000 at 5% for 3 years.", ["₹1200.50", "₹1261.00", "₹1285.00", "₹1300.00"], "₹1261.00", "Amount = 8000 x (1.05)^3 = 9261. CI = ₹1261."),
            _mcq(5, "Find rate if ₹1000 becomes ₹1210 in 2 years.", ["8%", "10%", "12%", "15%"], "10%", "1210 = 1000(1 + r/100)^2. So (1 + r/100)^2 = 1.21, giving r = 10%."),
            _mcq(6, "Find time if ₹5000 becomes ₹6050 at 10%.", ["1 year", "2 years", "3 years", "4 years"], "2 years", "6050 = 5000(1.10)^t. Since 1.10^2 = 1.21, time = 2 years."),
            _mcq(7, "Find CI on ₹6000 at 8% for 2 years.", ["₹948.40", "₹972.40", "₹998.40", "₹1024.00"], "₹998.40", "Amount = 6000 x (1.08)^2 = 6998.40. CI = ₹998.40."),
            _mcq(8, "Find SI if amount becomes ₹3300 from ₹3000 in 2 years.", ["₹250", "₹300", "₹350", "₹400"], "₹300", "SI = Amount - Principal = 3300 - 3000 = ₹300."),
            _mcq(9, "Find principal if SI = ₹400 at 5% for 2 years.", ["₹3500", "₹3800", "₹4000", "₹4500"], "₹4000", "P = (SI x 100)/(R x T) = (400 x 100)/(5 x 2) = ₹4000."),
            _mcq(10, "Find CI if principal ₹2000 becomes ₹2662 in 3 years.", ["₹620", "₹640", "₹662", "₹700"], "₹662", "CI = Amount - Principal = 2662 - 2000 = ₹662."),
        ],
    }

    question_bank["medium"][3]["options"] = ["₹460.80", "₹480.00", "₹499.20", "₹520.00"]
    return question_bank[difficulty]


def _build_averages(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Average of 2, 4, 6.", ["3", "4", "5", "6"], "4", "Average = (2 + 4 + 6) / 3 = 4."),
            _mcq(2, "Average of 10, 20, 30.", ["15", "20", "25", "30"], "20", "Average = (10 + 20 + 30) / 3 = 20."),
            _mcq(3, "Average of 5 numbers each 10.", ["8", "10", "12", "15"], "10", "If all 5 numbers are 10, the average is 10."),
            _mcq(4, "Average of 8 and 12.", ["8", "9", "10", "11"], "10", "Average = (8 + 12) / 2 = 10."),
            _mcq(5, "Average of 6, 9, 12.", ["8", "9", "10", "11"], "9", "Average = (6 + 9 + 12) / 3 = 9."),
            _mcq(6, "Average of 4, 8, 12, 16.", ["8", "9", "10", "11"], "10", "Average = (4 + 8 + 12 + 16) / 4 = 10."),
            _mcq(7, "Average of 10 numbers each 5.", ["4", "5", "6", "7"], "5", "If all 10 numbers are 5, the average is 5."),
            _mcq(8, "Average of 15 and 25.", ["18", "20", "22", "25"], "20", "Average = (15 + 25) / 2 = 20."),
            _mcq(9, "Average of 3, 6, 9, 12.", ["6", "7", "7.5", "8"], "7.5", "Average = (3 + 6 + 9 + 12) / 4 = 30 / 4 = 7.5."),
            _mcq(10, "Average of 20, 30, 40.", ["25", "30", "35", "40"], "30", "Average = (20 + 30 + 40) / 3 = 30."),
        ],
        "medium": [
            _mcq(1, "Average of first 10 natural numbers.", ["5", "5.5", "6", "6.5"], "5.5", "Average of first n natural numbers = (n + 1)/2 = 11/2 = 5.5."),
            _mcq(2, "Average of 5 numbers = 20. Find sum.", ["80", "90", "100", "110"], "100", "Sum = Average x Number of terms = 20 x 5 = 100."),
            _mcq(3, "Average of 10 numbers = 30. Find sum.", ["250", "280", "300", "320"], "300", "Sum = 30 x 10 = 300."),
            _mcq(4, "Average of 3 numbers = 15. If two are 10 and 20, find third.", ["10", "15", "20", "25"], "15", "Total sum = 3 x 15 = 45. Third number = 45 - 10 - 20 = 15."),
            _mcq(5, "Average of 4 numbers = 12. Sum?", ["36", "40", "48", "52"], "48", "Sum = 12 x 4 = 48."),
            _mcq(6, "Average of 8 numbers = 16. Sum?", ["112", "120", "128", "136"], "128", "Sum = 16 x 8 = 128."),
            _mcq(7, "Average of 6 numbers = 25. Sum?", ["120", "130", "140", "150"], "150", "Sum = 25 x 6 = 150."),
            _mcq(8, "Average of 3 numbers = 30. One is 40 and one 20. Find third.", ["20", "25", "30", "35"], "30", "Total sum = 3 x 30 = 90. Third number = 90 - 40 - 20 = 30."),
            _mcq(9, "Average of 7 numbers = 14. Sum?", ["84", "90", "94", "98"], "98", "Sum = 14 x 7 = 98."),
            _mcq(10, "Average of 5 numbers = 18. Sum?", ["80", "85", "90", "95"], "90", "Sum = 18 x 5 = 90."),
        ],
        "hard": [
            _mcq(1, "Average of 20 numbers = 25. If one number is removed average becomes 24. Find removed number.", ["35", "40", "44", "50"], "44", "Original sum = 20 x 25 = 500. New sum = 19 x 24 = 456. Removed number = 500 - 456 = 44."),
            _mcq(2, "Average age of 10 students = 15 years. If teacher included average becomes 18. Find teacher age.", ["45", "48", "50", "53"], "48", "Total age of students = 10 x 15 = 150. Total with teacher = 11 x 18 = 198. Teacher age = 198 - 150 = 48."),
            _mcq(3, "Average of 5 numbers = 40. If one number replaced by 50 average becomes 42. Find replaced number.", ["35", "38", "40", "42"], "40", "Old sum = 5 x 40 = 200. New sum = 5 x 42 = 210. Increase = 10, so replaced number = 50 - 10 = 40."),
            _mcq(4, "Average of 30 numbers = 60. If 10 numbers average 50, find average of remaining.", ["62", "64", "65", "66"], "65", "Total sum = 30 x 60 = 1800. Sum of 10 numbers = 10 x 50 = 500. Remaining sum = 1300. Average of remaining 20 numbers = 65."),
            _mcq(5, "Average of 10 numbers = 20. If 2 numbers removed average becomes 18. Find sum removed.", ["36", "40", "44", "48"], "56", "Original sum = 10 x 20 = 200. New sum = 8 x 18 = 144. Sum removed = 200 - 144 = 56."),
            _mcq(6, "Average weight of 8 people = 70 kg. One leaves and average becomes 68 kg. Find weight of person.", ["80 kg", "82 kg", "84 kg", "86 kg"], "84 kg", "Original total = 8 x 70 = 560. New total = 7 x 68 = 476. Weight of person = 560 - 476 = 84 kg."),
            _mcq(7, "Average of 40 students = 50 marks. Total marks?", ["1800", "1900", "2000", "2100"], "2000", "Total marks = 40 x 50 = 2000."),
            _mcq(8, "Average of 15 numbers = 25. Total sum?", ["325", "350", "375", "400"], "375", "Total sum = 15 x 25 = 375."),
            _mcq(9, "Average of 12 numbers = 30. Total sum?", ["300", "320", "340", "360"], "360", "Total sum = 12 x 30 = 360."),
            _mcq(10, "Average of 9 numbers = 27. Sum?", ["216", "225", "234", "243"], "243", "Total sum = 9 x 27 = 243."),
        ],
    }

    question_bank["hard"][4]["options"] = ["48", "52", "56", "60"]
    return question_bank[difficulty]


def _build_mixtures_alligations(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A mixture has milk and water in ratio 2:1. If total mixture is 30 L, find milk quantity.", ["10 L", "15 L", "20 L", "25 L"], "20 L", "Total parts = 3. Milk = 2/3 of 30 = 20 L."),
            _mcq(2, "A mixture contains 10 L milk and 5 L water. Find ratio.", ["1:2", "2:1", "3:1", "5:2"], "2:1", "Milk : water = 10 : 5 = 2 : 1."),
            _mcq(3, "If 20 L water is added to 20 L milk, find new ratio.", ["1:1", "2:1", "1:2", "3:2"], "1:1", "Milk and water are both 20 L, so ratio is 1:1."),
            _mcq(4, "A mixture contains 15 L milk and 10 L water. Find ratio.", ["3:2", "2:3", "5:2", "4:3"], "3:2", "Milk : water = 15 : 10 = 3 : 2."),
            _mcq(5, "If mixture ratio is 3:2 and total = 25 L, find milk.", ["10 L", "12 L", "15 L", "18 L"], "15 L", "Milk = 3/5 of 25 = 15 L."),
            _mcq(6, "Find water if mixture is 40 L with ratio 3:1.", ["8 L", "10 L", "12 L", "15 L"], "10 L", "Water = 1/4 of 40 = 10 L."),
            _mcq(7, "A mixture has 8 L milk and 2 L water. Find ratio.", ["2:1", "3:1", "4:1", "5:1"], "4:1", "Milk : water = 8 : 2 = 4 : 1."),
            _mcq(8, "If ratio is 5:3 and total mixture 40 L, find milk.", ["20 L", "24 L", "25 L", "30 L"], "25 L", "Milk = 5/8 of 40 = 25 L."),
            _mcq(9, "A mixture contains 18 L milk and 6 L water. Find ratio.", ["2:1", "3:1", "3:2", "4:1"], "3:1", "Milk : water = 18 : 6 = 3 : 1."),
            _mcq(10, "If mixture is 20 L with ratio 4:1, find water.", ["4 L", "5 L", "6 L", "8 L"], "4 L", "Water = 1/5 of 20 = 4 L."),
        ],
        "medium": [
            _mcq(1, "A mixture contains milk and water in ratio 4:1. If 5 L water added, ratio becomes 4:3. Find initial quantity.", ["10 L", "12.5 L", "15 L", "20 L"], "12.5 L", "Let milk = 4x and water = x. Then 4x:(x+5) = 4:3, so x = 2.5. Initial quantity = 5x = 12.5 L."),
            _mcq(2, "A mixture has 30 L milk and 10 L water. How much water must be added to make ratio 3:2?", ["5 L", "10 L", "15 L", "20 L"], "10 L", "30:(10+x) = 3:2 gives x = 10 L."),
            _mcq(3, "In a mixture of 40 L, milk:water = 3:1. How much water must be added to make ratio 2:1?", ["4 L", "5 L", "6 L", "8 L"], "5 L", "Initial milk = 30 L and water = 10 L. 30:(10+x) = 2:1 gives x = 5 L."),
            _mcq(4, "A milk seller mixes 10 L water in 40 L milk. Find new ratio.", ["3:1", "4:1", "5:1", "5:2"], "4:1", "New ratio = 40 : 10 = 4 : 1."),
            _mcq(5, "A mixture contains 50 L milk and 10 L water. How much water added to make ratio 5:2?", ["5 L", "8 L", "10 L", "12 L"], "10 L", "50:(10+x) = 5:2 gives x = 10 L."),
            _mcq(6, "A container has milk and water 5:3 in 40 L mixture. Find milk.", ["20 L", "22 L", "25 L", "28 L"], "25 L", "Milk = 5/8 of 40 = 25 L."),
            _mcq(7, "If 10 L mixture removed from 50 L mixture (ratio 3:2), find remaining milk.", ["20 L", "22 L", "24 L", "26 L"], "24 L", "Initial milk = 30 L. Removing 10 L mixture removes 6 L milk. Remaining milk = 24 L."),
            _mcq(8, "A mixture contains milk:water = 7:3. Total 50 L. Find water.", ["12 L", "15 L", "18 L", "21 L"], "15 L", "Water = 3/10 of 50 = 15 L."),
            _mcq(9, "If mixture 4:1 becomes 3:1 after adding water, how much water added in 20 L mixture?", ["1 L", "1.33 L", "2 L", "4 L"], "1.33 L", "Initial milk = 16 L and water = 4 L. 16:(4+x) = 3:1 gives x = 4/3 L = 1.33 L."),
            _mcq(10, "A mixture 3:2 total 25 L. Find milk.", ["10 L", "12 L", "15 L", "18 L"], "15 L", "Milk = 3/5 of 25 = 15 L."),
        ],
        "hard": [
            _mcq(1, "Two mixtures milk:water = 3:2 and 5:3 mixed equally. Find new ratio.", ["49:31", "31:49", "8:5", "7:4"], "49:31", "Take equal quantities. Milk = 3/5 + 5/8 and water = 2/5 + 3/8, so ratio = 49:31."),
            _mcq(2, "A container 40 L mixture (4:1). 10 L removed and replaced with water. Find new ratio.", ["3:2", "4:3", "5:2", "7:3"], "3:2", "Initial milk = 32 L, water = 8 L. After replacing 10 L with water, milk = 24 L and water = 16 L, so ratio = 3:2."),
            _mcq(3, "Two milk varieties ₹40/L and ₹60/L mixed to sell at ₹50/L. Find ratio.", ["1:1", "2:1", "1:2", "3:2"], "1:1", "By alligation, cheaper : dearer = (60-50):(50-40) = 10:10 = 1:1."),
            _mcq(4, "A container 60 L mixture (3:1). 15 L removed and water added. Find new ratio.", ["9:7", "7:9", "3:2", "5:3"], "9:7", "Initial milk = 45 L and water = 15 L. After removing 15 L mixture, milk = 33.75 L and water = 11.25 L. Adding 15 L water gives ratio 33.75:26.25 = 9:7."),
            _mcq(5, "Two mixtures 2:1 and 3:1 mixed in ratio 1:2. Find final ratio.", ["13:5", "5:13", "7:3", "3:1"], "13:5", "Take 1 unit and 2 units. Total milk = 13/6 and water = 5/6, so ratio = 13:5."),
            _mcq(6, "A milk seller mixes water equal to 20% of milk. Find ratio.", ["4:1", "5:1", "5:2", "6:1"], "5:1", "If water is 20% of milk, water = 1/5 of milk. So milk : water = 5 : 1."),
            _mcq(7, "A container has milk:water = 5:2. If 14 L water added, ratio becomes 5:4. Find mixture.", ["35 L", "42 L", "49 L", "56 L"], "49 L", "Let mixture be 7x. Then 5x:(2x+14) = 5:4, so x = 7. Mixture = 49 L."),
            _mcq(8, "Two solutions 30% and 50% acid mixed to get 40% solution. Find ratio.", ["1:1", "2:1", "1:2", "3:2"], "1:1", "By alligation, ratio = (50-40):(40-30) = 10:10 = 1:1."),
            _mcq(9, "A mixture 50 L (milk:water = 4:1). 10 L removed and replaced with milk. Find new ratio.", ["21:4", "19:6", "4:1", "5:1"], "21:4", "Initial milk = 40 L, water = 10 L. After removing 10 L mixture, milk = 32 L and water = 8 L. Adding 10 L milk gives 42:8 = 21:4."),
            _mcq(10, "A mixture milk:water = 7:5 total 48 L. 6 L water added. Find ratio.", ["14:13", "13:14", "7:6", "8:7"], "14:13", "Initial milk = 28 L and water = 20 L. Adding 6 L water gives ratio 28:26 = 14:13."),
        ],
    }
    return question_bank[difficulty]


def _build_permutations_combinations(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "In how many ways can 2 students be selected from 5?", [5, 8, 10, 12], 10, "Selection means combination. 5C2 = 10."),
            _mcq(2, "Find 5P1.", [1, 5, 10, 20], 5, "5P1 = 5."),
            _mcq(3, "Find 5C1.", [1, 5, 10, 20], 5, "5C1 = 5."),
            _mcq(4, "In how many ways can 3 students be chosen from 6?", [10, 15, 20, 25], 20, "6C3 = 20."),
            _mcq(5, "Find 4P2.", [8, 10, 12, 16], 12, "4P2 = 4 x 3 = 12."),
            _mcq(6, "Find 6C2.", [10, 12, 15, 18], 15, "6C2 = 15."),
            _mcq(7, "In how many ways can 2 letters be chosen from ABCD?", [4, 5, 6, 8], 6, "Choosing 2 letters from 4 means 4C2 = 6."),
            _mcq(8, "Find 3!.", [3, 4, 5, 6], 6, "3! = 3 x 2 x 1 = 6."),
            _mcq(9, "Find 4!.", [12, 16, 20, 24], 24, "4! = 4 x 3 x 2 x 1 = 24."),
            _mcq(10, "Find 5C2.", [5, 8, 10, 12], 10, "5C2 = 10."),
        ],
        "medium": [
            _mcq(1, "In how many ways can 3 students be selected from 8?", [28, 35, 48, 56], 56, "8C3 = 56."),
            _mcq(2, "Find 6P2.", [24, 30, 36, 42], 30, "6P2 = 6 x 5 = 30."),
            _mcq(3, "Find 7C3.", [21, 28, 35, 42], 35, "7C3 = 35."),
            _mcq(4, "In how many ways can 4 letters be arranged from ABCD?", [12, 18, 24, 30], 24, "All 4 letters can be arranged in 4! = 24 ways."),
            _mcq(5, "Find 5P3.", [40, 50, 60, 70], 60, "5P3 = 5 x 4 x 3 = 60."),
            _mcq(6, "Find 8C2.", [24, 28, 32, 36], 28, "8C2 = 28."),
            _mcq(7, "In how many ways can 2 students be chosen from 10?", [36, 40, 45, 50], 45, "10C2 = 45."),
            _mcq(8, "Find 6!.", [360, 480, 600, 720], 720, "6! = 720."),
            _mcq(9, "Find 7P2.", [35, 42, 49, 56], 42, "7P2 = 7 x 6 = 42."),
            _mcq(10, "Find 9C2.", [28, 32, 36, 40], 36, "9C2 = 36."),
        ],
        "hard": [
            _mcq(1, "In how many ways can letters of COMPUTER be arranged?", [20160, 30240, 40320, 50400], 40320, "COMPUTER has 8 distinct letters, so arrangements = 8! = 40320."),
            _mcq(2, "Find 10C3.", [90, 100, 110, 120], 120, "10C3 = 120."),
            _mcq(3, "Find 8P3.", [168, 224, 280, 336], 336, "8P3 = 8 x 7 x 6 = 336."),
            _mcq(4, "In how many ways can 5 people sit in 5 chairs?", [60, 120, 240, 720], 120, "Arrangement of 5 people in 5 chairs = 5! = 120."),
            _mcq(5, "In how many ways can 4 students be selected from 12?", [330, 420, 495, 560], 495, "12C4 = 495."),
            _mcq(6, "Find 9P4.", [1512, 2016, 2520, 3024], 3024, "9P4 = 9 x 8 x 7 x 6 = 3024."),
            _mcq(7, "Find 11C2.", [45, 50, 55, 60], 55, "11C2 = 55."),
            _mcq(8, "In how many ways can 3 books be arranged from 7 books?", [120, 180, 210, 240], 210, "Arrangement means permutation. 7P3 = 7 x 6 x 5 = 210."),
            _mcq(9, "Find 10P2.", [80, 90, 100, 110], 90, "10P2 = 10 x 9 = 90."),
            _mcq(10, "Find 12C3.", [200, 210, 220, 230], 220, "12C3 = 220."),
        ],
    }
    return question_bank[difficulty]


def _build_probability(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Probability of getting head when tossing a coin.", ["1/4", "1/3", "1/2", "1"], "1/2", "A coin has 2 equally likely outcomes, so probability of head = 1/2."),
            _mcq(2, "Probability of getting tail in coin toss.", ["1/4", "1/3", "1/2", "1"], "1/2", "A coin has 2 equally likely outcomes, so probability of tail = 1/2."),
            _mcq(3, "Probability of getting even number on dice.", ["1/3", "1/2", "2/3", "5/6"], "1/2", "Even numbers on a die are 2, 4, 6. Probability = 3/6 = 1/2."),
            _mcq(4, "Probability of getting number greater than 4 on dice.", ["1/6", "1/3", "1/2", "2/3"], "1/3", "Numbers greater than 4 are 5 and 6. Probability = 2/6 = 1/3."),
            _mcq(5, "Probability of getting 1 on dice.", ["1/6", "1/3", "1/2", "2/3"], "1/6", "Only one favorable outcome out of 6."),
            _mcq(6, "Probability of getting odd number on dice.", ["1/3", "1/2", "2/3", "5/6"], "1/2", "Odd numbers are 1, 3, 5. Probability = 3/6 = 1/2."),
            _mcq(7, "Probability of picking red ball from 1 red and 1 blue ball.", ["1/4", "1/3", "1/2", "2/3"], "1/2", "There is 1 red ball out of 2 total balls."),
            _mcq(8, "Probability of getting number less than 3 on dice.", ["1/6", "1/3", "1/2", "2/3"], "1/3", "Numbers less than 3 are 1 and 2. Probability = 2/6 = 1/3."),
            _mcq(9, "Probability of getting number greater than 2 on dice.", ["1/3", "1/2", "2/3", "5/6"], "2/3", "Numbers greater than 2 are 3, 4, 5, 6. Probability = 4/6 = 2/3."),
            _mcq(10, "Probability of getting tail in coin toss.", ["1/4", "1/3", "1/2", "1"], "1/2", "A coin has 2 equally likely outcomes, so probability of tail = 1/2."),
        ],
        "medium": [
            _mcq(1, "Two coins tossed. Probability of 2 heads.", ["1/4", "1/3", "1/2", "3/4"], "1/4", "Possible outcomes are HH, HT, TH, TT. Only HH works, so probability = 1/4."),
            _mcq(2, "Two coins tossed. Probability of 1 head.", ["1/4", "1/2", "3/4", "1"], "1/2", "Exactly one head occurs in HT and TH. Probability = 2/4 = 1/2."),
            _mcq(3, "A die thrown twice. Probability of sum = 7.", ["1/12", "1/6", "1/4", "5/18"], "1/6", "Favorable outcomes are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Probability = 6/36 = 1/6."),
            _mcq(4, "Probability of getting prime number on dice.", ["1/3", "1/2", "2/3", "5/6"], "1/2", "Prime numbers on a die are 2, 3, 5. Probability = 3/6 = 1/2."),
            _mcq(5, "A bag has 3 red and 2 blue balls. Find probability of red.", ["2/5", "1/2", "3/5", "4/5"], "3/5", "Probability of red = 3/5."),
            _mcq(6, "A die thrown. Probability of number ≤ 4.", ["1/3", "1/2", "2/3", "5/6"], "2/3", "Numbers 1, 2, 3, 4 are favorable. Probability = 4/6 = 2/3."),
            _mcq(7, "Two dice thrown. Probability of sum = 6.", ["1/12", "1/9", "5/36", "1/6"], "5/36", "Favorable outcomes are (1,5), (2,4), (3,3), (4,2), (5,1). Probability = 5/36."),
            _mcq(8, "Probability of getting head then tail.", ["1/4", "1/3", "1/2", "3/4"], "1/4", "Probability = 1/2 x 1/2 = 1/4."),
            _mcq(9, "Bag has 4 red, 3 blue balls. Find probability of blue.", ["2/7", "3/7", "4/7", "1/2"], "3/7", "Probability of blue = 3/7."),
            _mcq(10, "Probability of getting multiple of 3 on dice.", ["1/6", "1/3", "1/2", "2/3"], "1/3", "Multiples of 3 on a die are 3 and 6. Probability = 2/6 = 1/3."),
        ],
        "hard": [
            _mcq(1, "Two dice thrown. Probability sum = 8.", ["1/9", "5/36", "1/6", "7/36"], "5/36", "Favorable outcomes are (2,6), (3,5), (4,4), (5,3), (6,2). Probability = 5/36."),
            _mcq(2, "Two coins tossed. Probability at least one head.", ["1/4", "1/2", "3/4", "1"], "3/4", "All outcomes except TT have at least one head, so probability = 3/4."),
            _mcq(3, "A card drawn from deck. Probability of king.", ["1/26", "1/13", "1/4", "4/13"], "1/13", "There are 4 kings in 52 cards. Probability = 4/52 = 1/13."),
            _mcq(4, "Probability of heart card from deck.", ["1/13", "1/4", "1/2", "13/52"], "1/4", "There are 13 hearts in 52 cards. Probability = 13/52 = 1/4."),
            _mcq(5, "Two dice thrown. Probability sum = 10.", ["1/18", "1/12", "1/9", "5/36"], "1/12", "Favorable outcomes are (4,6), (5,5), (6,4). Probability = 3/36 = 1/12."),
            _mcq(6, "Bag has 5 red, 4 blue, 3 green balls. Find probability of green.", ["1/6", "1/4", "1/3", "3/10"], "1/4", "Total balls = 12. Probability of green = 3/12 = 1/4."),
            _mcq(7, "Two cards drawn. Probability both ace.", ["1/221", "1/169", "1/52", "2/221"], "1/221", "Probability = 4/52 x 3/51 = 12/2652 = 1/221."),
            _mcq(8, "Probability of getting face card from deck.", ["1/4", "3/13", "1/3", "4/13"], "3/13", "Face cards are J, Q, K. Total face cards = 12, so probability = 12/52 = 3/13."),
            _mcq(9, "Two dice thrown. Probability sum = 9.", ["1/9", "1/8", "5/36", "1/6"], "1/9", "Favorable outcomes are (3,6), (4,5), (5,4), (6,3). Probability = 4/36 = 1/9."),
            _mcq(10, "Probability of drawing queen from deck.", ["1/26", "1/13", "1/4", "3/13"], "1/13", "There are 4 queens in 52 cards. Probability = 4/52 = 1/13."),
        ],
    }
    return question_bank[difficulty]


def _build_number_system(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Find LCM of 6 and 8.", [12, 18, 24, 48], 24, "LCM of 6 and 8 is 24."),
            _mcq(2, "Find HCF of 12 and 18.", [3, 4, 6, 9], 6, "The highest common factor of 12 and 18 is 6."),
            _mcq(3, "Is 15 prime or composite?", ["Prime", "Composite", "Even", "Odd prime"], "Composite", "15 has factors 1, 3, 5, and 15, so it is composite."),
            _mcq(4, "Find LCM of 4 and 5.", [10, 20, 25, 40], 20, "LCM of 4 and 5 is 20."),
            _mcq(5, "Find HCF of 20 and 30.", [5, 10, 15, 20], 10, "The highest common factor of 20 and 30 is 10."),
            _mcq(6, "Write first 5 natural numbers.", ["0, 1, 2, 3, 4", "1, 2, 3, 4, 5", "2, 3, 4, 5, 6", "1, 3, 5, 7, 9"], "1, 2, 3, 4, 5", "Natural numbers start from 1."),
            _mcq(7, "Find square of 12.", [124, 132, 144, 154], 144, "12 x 12 = 144."),
            _mcq(8, "Find cube of 3.", [9, 18, 27, 36], 27, "3 x 3 x 3 = 27."),
            _mcq(9, "Find HCF of 9 and 27.", [3, 6, 9, 18], 9, "The highest common factor of 9 and 27 is 9."),
            _mcq(10, "Find LCM of 3 and 7.", [14, 18, 21, 28], 21, "LCM of 3 and 7 is 21."),
        ],
        "medium": [
            _mcq(1, "Find LCM of 12, 15.", [30, 45, 60, 90], 60, "LCM of 12 and 15 is 60."),
            _mcq(2, "Find HCF of 24, 36.", [6, 8, 12, 18], 12, "HCF of 24 and 36 is 12."),
            _mcq(3, "Find smallest number divisible by 4, 5, 6.", [40, 50, 60, 120], 60, "Smallest number divisible by all three is their LCM, 60."),
            _mcq(4, "Find square root of 144.", [10, 11, 12, 14], 12, "12 x 12 = 144."),
            _mcq(5, "Find cube root of 125.", [4, 5, 6, 7], 5, "5 x 5 x 5 = 125."),
            _mcq(6, "Find LCM of 8, 12.", [16, 20, 24, 48], 24, "LCM of 8 and 12 is 24."),
            _mcq(7, "Find HCF of 18, 24.", [3, 4, 6, 9], 6, "HCF of 18 and 24 is 6."),
            _mcq(8, "Find square of 25.", [525, 575, 600, 625], 625, "25 x 25 = 625."),
            _mcq(9, "Find cube of 5.", [25, 75, 100, 125], 125, "5 x 5 x 5 = 125."),
            _mcq(10, "Find LCM of 10, 15, 20.", [30, 45, 60, 120], 60, "LCM of 10, 15, and 20 is 60."),
        ],
        "hard": [
            _mcq(1, "Find LCM of 12, 15, 20.", [40, 50, 60, 120], 60, "LCM of 12, 15, and 20 is 60."),
            _mcq(2, "Find HCF of 48, 60, 72.", [6, 8, 10, 12], 12, "HCF of 48, 60, and 72 is 12."),
            _mcq(3, "Find greatest number dividing 56, 96 leaving same remainder.", [20, 30, 40, 48], 40, "Required number = HCF of (96 - 56) = 40."),
            _mcq(4, "Find smallest number divisible by 8, 12, 15.", [60, 90, 120, 180], 120, "Smallest number divisible by all is LCM = 120."),
            _mcq(5, "Find square root of 1024.", [16, 24, 32, 64], 32, "32 x 32 = 1024."),
            _mcq(6, "Find cube root of 512.", [6, 7, 8, 9], 8, "8 x 8 x 8 = 512."),
            _mcq(7, "Find LCM of 16, 20, 24.", [120, 180, 240, 320], 240, "LCM of 16, 20, and 24 is 240."),
            _mcq(8, "Find HCF of 36, 60, 84.", [6, 8, 10, 12], 12, "HCF of 36, 60, and 84 is 12."),
            _mcq(9, "Find square of 32.", [512, 768, 1024, 2048], 1024, "32 x 32 = 1024."),
            _mcq(10, "Find cube of 12.", [1296, 1440, 1728, 2048], 1728, "12 x 12 x 12 = 1728."),
        ],
    }
    return question_bank[difficulty]


def _build_data_interpretation(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A class has 20 boys and 10 girls. Total students?", [20, 25, 30, 35], 30, "Total students = 20 + 10 = 30."),
            _mcq(2, "If sales are 100, 120, 150, find total sales.", [320, 350, 370, 390], 370, "Total sales = 100 + 120 + 150 = 370."),
            _mcq(3, "Average of 5, 10, 15.", [8, 10, 12, 15], 10, "Average = (5 + 10 + 15) / 3 = 10."),
            _mcq(4, "A shop sells 10 pens and 20 pencils. Total items?", [20, 25, 30, 35], 30, "Total items = 10 + 20 = 30."),
            _mcq(5, "Total marks 80, 70, 90. Find sum.", [220, 230, 240, 250], 240, "Sum = 80 + 70 + 90 = 240."),
            _mcq(6, "Students 30 boys, 20 girls. Total?", [40, 45, 50, 55], 50, "Total students = 30 + 20 = 50."),
            _mcq(7, "Sales 200 Monday, 300 Tuesday. Total?", [400, 450, 500, 550], 500, "Total sales = 200 + 300 = 500."),
            _mcq(8, "Average of 20 and 40.", [20, 25, 30, 35], 30, "Average = (20 + 40) / 2 = 30."),
            _mcq(9, "Class has 40 students. 10 absent. Present?", [25, 30, 35, 40], 30, "Present students = 40 - 10 = 30."),
            _mcq(10, "Marks 50, 60, 70. Average?", [55, 60, 65, 70], 60, "Average = (50 + 60 + 70) / 3 = 60."),
        ],
        "medium": [
            _mcq(1, "Sales 100, 120, 150, 130. Find average.", [120, 125, 130, 135], 125, "Average = (100 + 120 + 150 + 130) / 4 = 125."),
            _mcq(2, "Company profit 20, 25, 30, 35. Total profit?", [100, 105, 110, 115], 110, "Total profit = 20 + 25 + 30 + 35 = 110."),
            _mcq(3, "Students 50, 10 absent. Percentage present?", ["70%", "75%", "80%", "90%"], "80%", "Present students = 40. Percentage present = 40/50 x 100 = 80%."),
            _mcq(4, "Average marks 60 of 5 students. Total marks?", [250, 280, 300, 320], 300, "Total marks = average x number = 60 x 5 = 300."),
            _mcq(5, "Sales 200, 300, 400. Total?", [800, 850, 900, 950], 900, "Total sales = 200 + 300 + 400 = 900."),
            _mcq(6, "If average 40 of 10 numbers, sum?", [300, 350, 400, 450], 400, "Sum = average x number = 40 x 10 = 400."),
            _mcq(7, "Profit 1000, 1500, 2000. Average?", [1200, 1400, 1500, 1600], 1500, "Average = (1000 + 1500 + 2000) / 3 = 1500."),
            _mcq(8, "Students 80 total, 20 girls. Boys?", [50, 55, 60, 65], 60, "Number of boys = 80 - 20 = 60."),
            _mcq(9, "Average age 20 of 5 students. Total age?", [80, 90, 100, 110], 100, "Total age = 20 x 5 = 100."),
            _mcq(10, "Sales 120, 150, 180. Total?", [420, 440, 450, 480], 450, "Total sales = 120 + 150 + 180 = 450."),
        ],
        "hard": [
            _mcq(1, "Average of 20 numbers = 30. Sum?", [500, 550, 600, 650], 600, "Sum = average x count = 20 x 30 = 600."),
            _mcq(2, "Average marks 50 of 40 students. Total marks?", [1800, 1900, 2000, 2100], 2000, "Total marks = 50 x 40 = 2000."),
            _mcq(3, "Sales Jan 100, Feb 200, Mar 300, Apr 400. Average?", [200, 225, 250, 275], 250, "Average = (100 + 200 + 300 + 400) / 4 = 250."),
            _mcq(4, "If 10 numbers average = 25, sum?", [200, 225, 250, 275], 250, "Sum = 10 x 25 = 250."),
            _mcq(5, "Average of 15 numbers = 20. Sum?", [250, 280, 300, 320], 300, "Sum = 15 x 20 = 300."),
            _mcq(6, "If 40 numbers average = 35, sum?", [1200, 1300, 1400, 1500], 1400, "Sum = 40 x 35 = 1400."),
            _mcq(7, "Students 100, 60 pass. Pass percentage?", ["50%", "55%", "60%", "65%"], "60%", "Pass percentage = 60/100 x 100 = 60%."),
            _mcq(8, "Average of 5 numbers = 50. Sum?", [200, 225, 250, 275], 250, "Sum = 5 x 50 = 250."),
            _mcq(9, "If average = 60 for 10 numbers, sum?", [500, 550, 600, 650], 600, "Sum = 10 x 60 = 600."),
            _mcq(10, "Average of 12 numbers = 40. Sum?", [440, 460, 480, 500], 480, "Sum = 12 x 40 = 480."),
        ],
    }
    return question_bank[difficulty]


def _build_geometry_mensuration(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Area of square with side 5 cm.", ["20 sq cm", "25 sq cm", "30 sq cm", "35 sq cm"], "25 sq cm", "Area of square = side x side = 5 x 5 = 25 sq cm."),
            _mcq(2, "Perimeter of square side 6 cm.", ["12 cm", "18 cm", "24 cm", "36 cm"], "24 cm", "Perimeter of square = 4 x side = 24 cm."),
            _mcq(3, "Area of rectangle length 10 width 5.", ["40 sq cm", "45 sq cm", "50 sq cm", "55 sq cm"], "50 sq cm", "Area of rectangle = length x breadth = 10 x 5 = 50 sq cm."),
            _mcq(4, "Perimeter of rectangle 8 and 4.", ["20 cm", "22 cm", "24 cm", "26 cm"], "24 cm", "Perimeter = 2 x (8 + 4) = 24 cm."),
            _mcq(5, "Area of triangle base 10 height 6.", ["25 sq cm", "30 sq cm", "35 sq cm", "40 sq cm"], "30 sq cm", "Area of triangle = 1/2 x base x height = 30 sq cm."),
            _mcq(6, "Circumference of circle radius 7.", ["22 cm", "44 cm", "77 cm", "154 cm"], "44 cm", "Circumference = 2πr = 2 x 22/7 x 7 = 44 cm."),
            _mcq(7, "Area of circle radius 7.", ["44 sq cm", "77 sq cm", "154 sq cm", "308 sq cm"], "154 sq cm", "Area = πr² = 22/7 x 7 x 7 = 154 sq cm."),
            _mcq(8, "Volume of cube side 4.", ["16 cu cm", "32 cu cm", "48 cu cm", "64 cu cm"], "64 cu cm", "Volume of cube = side³ = 4³ = 64 cu cm."),
            _mcq(9, "Surface area cube side 5.", ["100 sq cm", "125 sq cm", "150 sq cm", "175 sq cm"], "150 sq cm", "Surface area of cube = 6a² = 6 x 25 = 150 sq cm."),
            _mcq(10, "Area rectangle 12 × 6.", ["60 sq cm", "66 sq cm", "72 sq cm", "78 sq cm"], "72 sq cm", "Area = 12 x 6 = 72 sq cm."),
        ],
        "medium": [
            _mcq(1, "Area of circle radius 14.", ["308 sq cm", "440 sq cm", "616 sq cm", "704 sq cm"], "616 sq cm", "Area = πr² = 22/7 x 14 x 14 = 616 sq cm."),
            _mcq(2, "Volume of cylinder r=7 h=10.", ["980 cu cm", "1232 cu cm", "1540 cu cm", "1760 cu cm"], "1540 cu cm", "Volume = πr²h = 22/7 x 49 x 10 = 1540 cu cm."),
            _mcq(3, "Area triangle sides 5, 6, 7.", ["12.5 sq cm", "14.7 sq cm", "18 sq cm", "21 sq cm"], "14.7 sq cm", "Using Heron's formula, s = 9 and area = √(9 x 4 x 3 x 2) = √216 ≈ 14.7 sq cm."),
            _mcq(4, "Area square side 12.", ["124 sq cm", "134 sq cm", "144 sq cm", "154 sq cm"], "144 sq cm", "Area of square = 12 x 12 = 144 sq cm."),
            _mcq(5, "Perimeter rectangle length 15 width 10.", ["45 cm", "50 cm", "55 cm", "60 cm"], "50 cm", "Perimeter = 2 x (15 + 10) = 50 cm."),
            _mcq(6, "Volume cube side 8.", ["256 cu cm", "384 cu cm", "512 cu cm", "640 cu cm"], "512 cu cm", "Volume = 8³ = 512 cu cm."),
            _mcq(7, "Area circle radius 10.", ["300 sq cm", "314 sq cm", "350 sq cm", "400 sq cm"], "314 sq cm", "Area = πr² ≈ 3.14 x 100 = 314 sq cm."),
            _mcq(8, "Surface area cube side 6.", ["180 sq cm", "196 sq cm", "216 sq cm", "256 sq cm"], "216 sq cm", "Surface area = 6 x 6² = 216 sq cm."),
            _mcq(9, "Area rectangle 20 × 15.", ["250 sq cm", "280 sq cm", "300 sq cm", "320 sq cm"], "300 sq cm", "Area = 20 x 15 = 300 sq cm."),
            _mcq(10, "Circumference circle radius 14.", ["44 cm", "66 cm", "88 cm", "96 cm"], "88 cm", "Circumference = 2πr = 2 x 22/7 x 14 = 88 cm."),
        ],
        "hard": [
            _mcq(1, "Area triangle sides 13, 14, 15.", ["72 sq cm", "78 sq cm", "84 sq cm", "90 sq cm"], "84 sq cm", "Using Heron's formula, s = 21 and area = √(21 x 8 x 7 x 6) = 84 sq cm."),
            _mcq(2, "Volume sphere radius 7.", ["1232 cu cm", "1437 cu cm", "1540 cu cm", "1760 cu cm"], "1437 cu cm", "Volume = 4/3 x π x 7³ ≈ 1437 cu cm."),
            _mcq(3, "Surface area sphere radius 14.", ["1232 sq cm", "1848 sq cm", "2464 sq cm", "3080 sq cm"], "2464 sq cm", "Surface area = 4πr² = 4 x 22/7 x 14² = 2464 sq cm."),
            _mcq(4, "Volume cylinder r=7 h=20.", ["2464 cu cm", "3080 cu cm", "3520 cu cm", "3920 cu cm"], "3080 cu cm", "Volume = πr²h = 22/7 x 49 x 20 = 3080 cu cm."),
            _mcq(5, "Area sector radius 7 angle 90°.", ["19.25 sq cm", "38.5 sq cm", "44 sq cm", "77 sq cm"], "38.5 sq cm", "Area of sector = 90/360 x π x 7² = 38.5 sq cm."),
            _mcq(6, "Area trapezium parallel sides 10, 14 height 6.", ["60 sq cm", "72 sq cm", "84 sq cm", "96 sq cm"], "72 sq cm", "Area = 1/2 x (10 + 14) x 6 = 72 sq cm."),
            _mcq(7, "Volume cone r=7 h=24.", ["1078 cu cm", "1232 cu cm", "1540 cu cm", "1760 cu cm"], "1232 cu cm", "Volume = 1/3 x π x 7² x 24 = 1232 cu cm."),
            _mcq(8, "Area rhombus diagonals 10, 12.", ["50 sq cm", "55 sq cm", "60 sq cm", "65 sq cm"], "60 sq cm", "Area of rhombus = 1/2 x d1 x d2 = 1/2 x 10 x 12 = 60 sq cm."),
            _mcq(9, "Area parallelogram base 12 height 8.", ["84 sq cm", "90 sq cm", "96 sq cm", "104 sq cm"], "96 sq cm", "Area of parallelogram = base x height = 12 x 8 = 96 sq cm."),
            _mcq(10, "Area circle diameter 28.", ["308 sq cm", "440 sq cm", "616 sq cm", "784 sq cm"], "616 sq cm", "Radius = 14 cm. Area = πr² = 22/7 x 14 x 14 = 616 sq cm."),
        ],
    }
    return question_bank[difficulty]


def _shift_word(word, shift):
    out = []
    for char in word.upper():
        if "A" <= char <= "Z":
            out.append(chr(((ord(char) - 65 + shift) % 26) + 65))
        else:
            out.append(char)
    return "".join(out)


def _build_coding_decoding(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "If CAT \u2192 DBU, then DOG \u2192 ?", ["EPH", "FPH", "EOH", "DPI"], "EPH", "Following the same +1 letter shift pattern, DOG becomes EPH."),
            _mcq(2, "If SUN \u2192 TVO, then MOON \u2192 ?", ["NPPO", "NQPO", "MOPO", "NOPO"], "NPPO", "Following the given pattern, each letter shifts by +1, so MOON becomes NPPO."),
            _mcq(3, "If APPLE \u2192 BQQMF, then BALL \u2192 ?", ["CBMM", "CBMN", "CBNL", "DBMM"], "CBMM", "Using the same +1 shift pattern, BALL becomes CBMM."),
            _mcq(4, "If BAT \u2192 YZG, then CAT \u2192 ?", ["XZG", "YZH", "XZH", "WZG"], "XZG", "Following the reverse-style pattern shown, CAT becomes XZG."),
            _mcq(5, "If PEN \u2192 QFO, then BOOK \u2192 ?", ["CPPL", "CPPK", "DQQM", "BPPK"], "CPPL", "Applying the +1 shift pattern to each letter, BOOK becomes CPPL."),
            _mcq(6, "If DOG \u2192 FQI, then CAT \u2192 ?", ["ECV", "DBU", "FDU", "EBU"], "DBU", "Using the common +1 pattern for each letter here, CAT becomes DBU."),
            _mcq(7, "If RED \u2192 SFE, then BLUE \u2192 ?", ["CMVF", "CMWF", "BLVF", "DLVF"], "CMVF", "Each letter shifts by +1, so BLUE becomes CMVF."),
            _mcq(8, "If TOP \u2192 UPR, then MAP \u2192 ?", ["NBQ", "NBR", "MCQ", "OBQ"], "NBQ", "Following the same +1 shift pattern, MAP becomes NBQ."),
            _mcq(9, "If HAT \u2192 IBU, then MAT \u2192 ?", ["NBU", "NCU", "MBU", "NAT"], "NBU", "Each letter shifts by +1, so MAT becomes NBU."),
            _mcq(10, "If DAY \u2192 EBZ, then NIGHT \u2192 ?", ["OJHIU", "OJHJU", "OJIHU", "NJHIU"], "OJHIU", "Following the +1 shift pattern, NIGHT becomes OJHIU."),
        ],
        "medium": [
            _mcq(1, "If 123 \u2192 246, then 345 \u2192 ?", ["6810", "6910", "6812", "81012"], "6810", "Each digit is doubled: 3, 4, 5 become 6, 8, 10."),
            _mcq(2, "If CODE \u2192 DPEF, then DATA \u2192 ?", ["EBUB", "EBTA", "DCUB", "EBVA"], "EBUB", "Applying a +1 letter shift, DATA becomes EBUB."),
            _mcq(3, "If TREE \u2192 USFF, then LEAF \u2192 ?", ["MFBG", "MFCG", "NEBG", "MEBG"], "MFBG", "Following the same +1 shift pattern, LEAF becomes MFBG."),
            _mcq(4, "If GOLD \u2192 IQNF, then SILVER \u2192 ?", ["UKNXGT", "TJMWFS", "TJNXFS", "VKMXGT"], "TJMWFS", "Using the +1 shift pattern on each letter, SILVER becomes TJMWFS."),
            _mcq(5, "If 5 \u2192 25, 6 \u2192 36, then 9 \u2192 ?", ["18", "27", "81", "99"], "81", "The pattern is squaring the number, so 9 becomes 81."),
            _mcq(6, "If FISH \u2192 GJTI, then BIRD \u2192 ?", ["CJSE", "CJTD", "CKSE", "BJSF"], "CJSE", "Applying the +1 shift pattern, BIRD becomes CJSE."),
            _mcq(7, "If PAPER \u2192 QBQFS, then BOOK \u2192 ?", ["CPPL", "CQQL", "CPPK", "BPPL"], "CPPL", "Each letter shifts by +1, so BOOK becomes CPPL."),
            _mcq(8, "If 12 \u2192 144, then 15 \u2192 ?", ["205", "215", "225", "235"], "225", "The pattern is squaring the number, so 15 becomes 225."),
            _mcq(9, "If STAR \u2192 TUBS, then PLANET \u2192 ?", ["QMBOFU", "QLBNEU", "PMBOFU", "QMCPGV"], "QMBOFU", "With each letter shifted by +1, PLANET becomes QMBOFU."),
            _mcq(10, "If 4 \u2192 16, 7 \u2192 49, then 11 \u2192 ?", ["111", "121", "131", "141"], "121", "The pattern is squaring the number, so 11 becomes 121."),
        ],
        "hard": [
            _mcq(1, "If COMPUTER \u2192 RFUVQNPC, then MOBILE \u2192 ?", ["DGNKQO", "GNKQDO", "ELNQHP", "GMKQDO"], "GNKQDO", "Following the same reverse-and-shift style pattern used in the example, MOBILE becomes GNKQDO."),
            _mcq(2, "If TRAIN \u2192 UQCKP, then PLANE \u2192 ?", ["RNCPG", "QMBOD", "RMBOD", "QMBOF"], "QMBOD", "Following the same letter-position change pattern as the example, PLANE becomes QMBOD."),
            _mcq(3, "If DELHI \u2192 EFMIJ, then MUMBAI \u2192 ?", ["NVNCBJ", "NVNDBJ", "NVNCAJ", "OVNDBK"], "NVNCBJ", "Applying the same forward-shift style from the example, MUMBAI becomes NVNCBJ."),
            _mcq(4, "If 246 \u2192 864, then 135 \u2192 ?", ["531", "642", "753", "975"], "531", "The pattern reverses the digits, so 135 becomes 531."),
            _mcq(5, "If TABLE \u2192 GZYOV, then CHAIR \u2192 ?", ["XSZRI", "XSRZI", "XSZRI", "YSZRI"], "XSZRI", "Using the same opposite-end alphabet pattern shown, CHAIR becomes XSZRI."),
            _mcq(6, "If SPARK \u2192 TQBSL, then SMOKE \u2192 ?", ["TNPLF", "TNOLF", "UMPLF", "TNOKF"], "TNPLF", "Following the same shifting pattern as the example, SMOKE becomes TNPLF."),
            _mcq(7, "If 987 \u2192 789, then 654 \u2192 ?", ["456", "465", "546", "564"], "456", "The pattern reverses the digits, so 654 becomes 456."),
            _mcq(8, "If LIGHT \u2192 MJHIU, then POWER \u2192 ?", ["QPXFS", "QOWFS", "QPWFS", "RPXFS"], "QPXFS", "Using a +1 shift on each letter, POWER becomes QPXFS."),
            _mcq(9, "If PHONE \u2192 SKRQH, then RADIO \u2192 ?", ["UDGLR", "TCFHN", "SBEGM", "VCHLR"], "UDGLR", "Following the same encoded pattern used in the example, RADIO becomes UDGLR."),
            _mcq(10, "If CLOCK \u2192 DMPDL, then WATCH \u2192 ?", ["XBUCI", "XBUDI", "YBUCI", "XATCI"], "XBUDI", "Following the same transformation style as the example, WATCH becomes XBUDI."),
        ],
    }
    return question_bank[difficulty]


def _build_blood_relations(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A is the father of B. B is the sister of C. What is A to C?", ["Father", "Brother", "Uncle", "Grandfather"], "Father", "If B and C are siblings and A is father of B, then A is also father of C."),
            _mcq(2, "P is the mother of Q. Q is the brother of R. What is P to R?", ["Mother", "Sister", "Aunt", "Grandmother"], "Mother", "If Q and R are siblings, P is mother of both."),
            _mcq(3, "Ram is the son of Shyam. What is Shyam to Ram?", ["Brother", "Father", "Uncle", "Grandfather"], "Father", "If Ram is the son of Shyam, then Shyam is Ram's father."),
            _mcq(4, "A woman is the mother of a boy. How is the boy related to her?", ["Son", "Brother", "Nephew", "Father"], "Son", "A boy of a mother is her son."),
            _mcq(5, "X is the father of Y. Y is the son of Z. How is Z related to X?", ["Sister", "Wife", "Mother", "Daughter"], "Wife", "If X is father of Y and Y is son of Z, Z is the other parent, so Z is X's wife."),
            _mcq(6, "A girl is the daughter of her mother. What is the mother to the girl?", ["Sister", "Aunt", "Mother", "Grandmother"], "Mother", "The mother of a girl is simply her mother."),
            _mcq(7, "R is the brother of S. S is the sister of T. What is R to T?", ["Brother", "Cousin", "Father", "Uncle"], "Brother", "R and S are siblings, and S and T are siblings, so R is brother of T."),
            _mcq(8, "K is the father of M. M is the mother of N. How is K related to N?", ["Father", "Grandfather", "Uncle", "Brother"], "Grandfather", "K is parent of M, and M is parent of N, so K is grandfather of N."),
            _mcq(9, "P is the sister of Q. Q is the son of R. What is P to R?", ["Daughter", "Mother", "Sister", "Aunt"], "Daughter", "If Q is son of R and P is Q's sister, then P is also child of R."),
            _mcq(10, "A is the mother of B. B is the father of C. How is A related to C?", ["Mother", "Grandmother", "Aunt", "Sister"], "Grandmother", "A is mother of B, and B is father of C, so A is grandmother of C."),
        ],
        "medium": [
            _mcq(1, "A is the brother of B. B is the mother of C. How is A related to C?", ["Father", "Brother", "Uncle", "Grandfather"], "Uncle", "A is sibling of C's mother, so A is uncle of C."),
            _mcq(2, "X is the father of Y. Y is the sister of Z. How is X related to Z?", ["Father", "Brother", "Uncle", "Grandfather"], "Father", "Y and Z are siblings, so X is father of both."),
            _mcq(3, "A is the mother of B. C is the husband of A. What is C to B?", ["Brother", "Father", "Uncle", "Grandfather"], "Father", "The husband of a child's mother is the father."),
            _mcq(4, "P is the brother of Q. Q is the mother of R. How is P related to R?", ["Father", "Uncle", "Brother", "Grandfather"], "Uncle", "P is sibling of R's mother, so P is uncle of R."),
            _mcq(5, "A woman says: 'He is the son of my father.' Who is he?", ["Brother", "Son", "Father", "Uncle"], "Brother", "The son of a woman's father is her brother."),
            _mcq(6, "A man says: 'She is the daughter of my grandfather.' Who is she?", ["Mother", "Sister", "Aunt", "Daughter"], "Aunt", "The daughter of his grandfather is his aunt if not his mother; standard answer is aunt."),
            _mcq(7, "If A is B's sister and B is C's son, what is A to C?", ["Mother", "Daughter", "Sister", "Aunt"], "Daughter", "If B is son of C, then A as B's sister is also child of C."),
            _mcq(8, "P is the father of Q. Q is the sister of R. How is P related to R?", ["Father", "Uncle", "Brother", "Grandfather"], "Father", "Q and R are siblings, so P is father of both."),
            _mcq(9, "X is the son of Y. Y is the sister of Z. What is Z to X?", ["Uncle or Aunt", "Brother", "Father", "Cousin"], "Uncle or Aunt", "Z is sibling of X's parent, but gender is not given."),
            _mcq(10, "A is the father of B. C is the brother of A. What is C to B?", ["Uncle", "Father", "Brother", "Grandfather"], "Uncle", "C is brother of B's father, so C is uncle."),
        ],
        "hard": [
            _mcq(1, "A is B's brother. B is C's mother. C is D's sister. How is A related to D?", ["Uncle", "Brother", "Grandfather", "Father"], "Uncle", "B is mother of C and D, so A is maternal uncle of D."),
            _mcq(2, "P is Q's father. Q is R's sister. R is S's husband. How is P related to S?", ["Father-in-law", "Brother-in-law", "Uncle", "Grandfather"], "Father-in-law", "P is father of R. Since R is husband of S, P is father-in-law of S."),
            _mcq(3, "A woman says: 'The boy is the son of my husband's sister.' How is she related to the boy?", ["Mother", "Aunt", "Sister", "Grandmother"], "Aunt", "The boy is child of her husband's sister, so she is the boy's aunt by marriage."),
            _mcq(4, "A is the mother of B. B is the brother of C. C is the father of D. How is A related to D?", ["Mother", "Grandmother", "Aunt", "Sister"], "Grandmother", "A is mother of C, and C is father of D, so A is grandmother of D."),
            _mcq(5, "X is Y's sister. Y is Z's son. How is X related to Z?", ["Daughter", "Mother", "Sister", "Aunt"], "Daughter", "If Y is son of Z, X as Y's sister is also child of Z."),
            _mcq(6, "A man says: 'My mother's brother's daughter is my...'", ["Sister", "Cousin", "Aunt", "Niece"], "Cousin", "Mother's brother is maternal uncle; his daughter is cousin."),
            _mcq(7, "P is the father of Q. Q is the mother of R. R is the sister of S. How is P related to S?", ["Grandfather", "Father", "Uncle", "Brother"], "Grandfather", "P is parent of Q, and Q is parent of S, so P is grandfather."),
            _mcq(8, "A woman introduces a boy as the son of her husband's brother. How is the boy related to her?", ["Son", "Nephew", "Brother", "Cousin"], "Nephew", "Her husband's brother's son is her nephew."),
            _mcq(9, "A is the father of B. B is the father of C. C is the father of D. How is A related to D?", ["Grandfather", "Great-grandfather", "Uncle", "Father"], "Great-grandfather", "A -> B -> C -> D spans three generations, so A is great-grandfather of D."),
            _mcq(10, "X is the sister of Y. Y is the father of Z. How is X related to Z?", ["Mother", "Aunt", "Sister", "Grandmother"], "Aunt", "X is sibling of Z's father, so X is aunt of Z."),
        ],
    }
    return question_bank[difficulty]


def _build_syllogism(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Statements: All cats are animals. All animals are living. Which conclusion follows?", ["Cats are living", "Animals are cats", "Some living are cats", "No conclusion"], "Cats are living", "If all cats are animals and all animals are living, then all cats are living."),
            _mcq(2, "Statements: All dogs are mammals. All mammals are animals. Which conclusion follows?", ["Dogs are animals", "Animals are dogs", "Some animals are not mammals", "No conclusion"], "Dogs are animals", "All dogs fall under mammals and mammals under animals."),
            _mcq(3, "Statements: All apples are fruits. Some fruits are sweet. Which conclusion follows?", ["Some apples are sweet", "All apples are fruits", "All fruits are apples", "No conclusion"], "All apples are fruits", "Only the direct statement is definitely true; sweetness of apples is not certain."),
            _mcq(4, "Statements: All boys are students. All students are learners. Which conclusion follows?", ["Boys are learners", "Learners are boys", "Some learners are not students", "No conclusion"], "Boys are learners", "All boys are students and all students are learners."),
            _mcq(5, "Statements: Some cars are red. All red things are bright. Which conclusion follows?", ["Some cars are bright", "All cars are bright", "No red thing is bright", "No conclusion"], "Some cars are bright", "Some cars are red, and all red things are bright."),
            _mcq(6, "Statements: All teachers are educated. All educated people are respected. Which conclusion follows?", ["Teachers are respected", "Respected people are teachers", "Some teachers are not educated", "No conclusion"], "Teachers are respected", "All teachers fall under educated, and educated under respected."),
            _mcq(7, "Statements: Some books are novels. All novels are stories. Which conclusion follows?", ["Some books are stories", "All books are stories", "No books are stories", "No conclusion"], "Some books are stories", "The books that are novels must be stories."),
            _mcq(8, "Statements: All birds fly. Sparrow is a bird. Which conclusion follows?", ["Sparrow flies", "All flying things are birds", "No sparrow flies", "No conclusion"], "Sparrow flies", "Sparrow belongs to birds, so it flies."),
            _mcq(9, "Statements: All pens write. Some pens are blue. Which conclusion follows?", ["Some blue things write", "All blue things are pens", "No pens write", "No conclusion"], "Some blue things write", "The blue pens are still pens, and all pens write."),
            _mcq(10, "Statements: All flowers smell good. Rose is a flower. Which conclusion follows?", ["Rose smells good", "All good smells are flowers", "Rose is not a flower", "No conclusion"], "Rose smells good", "Rose belongs to flowers, and all flowers smell good."),
        ],
        "medium": [
            _mcq(1, "Statements: All A are B. Some B are C. Which conclusion follows?", ["Some A are C", "Some C are B", "All C are A", "No conclusion"], "Some C are B", "From 'Some B are C', it follows that some C are B."),
            _mcq(2, "Statements: No A is B. Some B are C. Which conclusion follows?", ["No A is C", "Some C are B", "All C are A", "No conclusion"], "Some C are B", "The only definite conclusion is the converse of 'Some B are C'."),
            _mcq(3, "Statements: Some A are B. All B are C. Which conclusion follows?", ["Some A are C", "All A are C", "No C is A", "No conclusion"], "Some A are C", "The A that are B must also be C."),
            _mcq(4, "Statements: All A are B. All B are C. Which conclusion follows?", ["All A are C", "All C are A", "Some C are not B", "No conclusion"], "All A are C", "Transitive relation gives All A are C."),
            _mcq(5, "Statements: Some A are B. Some B are C. Which conclusion follows?", ["Some A are C", "Some C are A", "No conclusion", "All A are C"], "No conclusion", "The two 'some' groups may be different, so no direct link is certain."),
            _mcq(6, "Statements: No A is B. All B are C. Which conclusion follows?", ["No A is C", "Some C are B", "All C are B", "No conclusion"], "Some C are B", "From All B are C, the existence-based expected conclusion is some C are B."),
            _mcq(7, "Statements: All dogs are animals. Some animals are pets. Which conclusion follows?", ["Some dogs are pets", "Some pets are animals", "All pets are dogs", "No conclusion"], "Some pets are animals", "If some animals are pets, then some pets are animals."),
            _mcq(8, "Statements: Some books are interesting. All interesting things are useful. Which conclusion follows?", ["Some books are useful", "All books are useful", "No useful thing is interesting", "No conclusion"], "Some books are useful", "The books that are interesting must be useful."),
            _mcq(9, "Statements: No cat is dog. Some dogs are pets. Which conclusion follows?", ["Some pets are dogs", "No pet is cat", "Some cats are pets", "No conclusion"], "Some pets are dogs", "This directly follows from 'Some dogs are pets'."),
            _mcq(10, "Statements: Some fruits are sweet. All sweets are tasty. Which conclusion follows?", ["Some fruits are tasty", "All fruits are tasty", "No sweet is tasty", "No conclusion"], "Some fruits are tasty", "The fruits that are sweet must be tasty."),
        ],
        "hard": [
            _mcq(1, "Statements: All A are B. Some B are not C. Which conclusion follows?", ["Some A are not C", "Some B are not C", "No A is C", "No conclusion"], "Some B are not C", "This is directly given; nothing specific about A follows."),
            _mcq(2, "Statements: No A is B. No B is C. Which conclusion follows?", ["No A is C", "Some C are A", "No conclusion", "All A are C"], "No conclusion", "A and C may still overlap, so no definite relation follows."),
            _mcq(3, "Statements: Some A are B. No B is C. Which conclusion follows?", ["Some A are not C", "All A are not C", "Some C are A", "No conclusion"], "Some A are not C", "The A that are B cannot be C."),
            _mcq(4, "Statements: All A are B. Some C are B. Which conclusion follows?", ["Some C are A", "All B are A", "No conclusion", "Some A are C"], "No conclusion", "C being inside B does not guarantee any overlap with A."),
            _mcq(5, "Statements: No A is B. Some C are A. Which conclusion follows?", ["Some C are not B", "All C are not B", "Some B are C", "No conclusion"], "Some C are not B", "The C that are A cannot be B."),
            _mcq(6, "Statements: Some A are B. Some B are C. Which conclusion follows?", ["Some A are C", "Some C are A", "No conclusion", "All A are C"], "No conclusion", "The overlapping B groups may be different."),
            _mcq(7, "Statements: All A are B. All C are B. Which conclusion follows?", ["All A are C", "All C are A", "Some A are C", "No conclusion"], "No conclusion", "A and C are both inside B, but their relation is unknown."),
            _mcq(8, "Statements: Some A are not B. All B are C. Which conclusion follows?", ["Some A are not C", "Some A are not B", "All A are C", "No conclusion"], "Some A are not B", "This is directly stated; no certain C relation for those A."),
            _mcq(9, "Statements: No A is B. Some B are not C. Which conclusion follows?", ["Some B are not C", "Some A are not C", "No A is C", "No conclusion"], "Some B are not C", "Only the direct statement follows definitely."),
            _mcq(10, "Statements: All A are B. Some B are C. Some C are D. Which conclusion follows?", ["Some B are D", "Some C are D", "Some A are D", "No conclusion"], "Some C are D", "This is directly stated; other relationships are uncertain."),
        ],
    }
    return question_bank[difficulty]


def _build_direction_sense(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Ravi walks 10 m north, then 5 m east. Where is he now?", ["North-East", "North-West", "South-East", "East"], "North-East", "He is north and east of the starting point."),
            _mcq(2, "A person walks 5 m south then 10 m north. Where is he?", ["5 m north", "5 m south", "At start", "10 m north"], "5 m north", "Net movement is 5 m north."),
            _mcq(3, "Ram walks east then west. Where is he facing?", ["East", "West", "North", "South"], "West", "After moving west, he faces west."),
            _mcq(4, "A man walks north then turns right. Which direction?", ["East", "West", "North", "South"], "East", "Right turn from north is east."),
            _mcq(5, "A person walks south then turns left. Which direction?", ["East", "West", "North", "South"], "East", "Left turn from south is east."),
            _mcq(6, "If you face east and turn left, direction?", ["North", "South", "West", "East"], "North", "Left turn from east is north."),
            _mcq(7, "If you face north and turn right, direction?", ["East", "West", "North", "South"], "East", "Right turn from north is east."),
            _mcq(8, "A person walks north then south. Where is he?", ["At start", "North", "South", "East"], "At start", "Equal opposite movement returns to start."),
            _mcq(9, "If you face west and turn right, direction?", ["North", "South", "East", "West"], "North", "Right turn from west is north."),
            _mcq(10, "If you face south and turn left, direction?", ["East", "West", "North", "South"], "East", "Left turn from south is east."),
        ],
        "medium": [
            _mcq(1, "A person walks 10 m north, 5 m east, 10 m south. Where is he?", ["5 m east", "5 m west", "At start", "10 m east"], "5 m east", "North and south cancel; only 5 m east remains."),
            _mcq(2, "A man walks 5 m east, then 5 m north. Distance from start?", ["5 m", "7.07 m", "10 m", "12 m"], "7.07 m", "Use Pythagoras: sqrt(5^2 + 5^2) = sqrt(50) ≈ 7.07 m."),
            _mcq(3, "A person walks 10 m west, 5 m south. Direction from start?", ["South-West", "North-West", "South-East", "West"], "South-West", "He is west and south of start."),
            _mcq(4, "A man walks north, east, south. Where is he?", ["East of start", "West of start", "At start", "North of start"], "East of start", "North and south cancel, leaving east."),
            _mcq(5, "A person walks east 10 m then west 5 m. Where is he?", ["5 m east", "5 m west", "At start", "10 m west"], "5 m east", "Net movement is 5 m east."),
            _mcq(6, "A person walks north 15 m then south 5 m. Distance?", ["5 m", "10 m", "15 m", "20 m"], "10 m", "Net movement is 10 m north."),
            _mcq(7, "A man walks 10 m south then east 10 m. Where is he?", ["South-East", "South-West", "North-East", "East"], "South-East", "He is south and east of the start."),
            _mcq(8, "A person walks west then north. Direction?", ["North-West", "North-East", "South-West", "West"], "North-West", "West followed by north places the person north-west."),
            _mcq(9, "A man walks east then south. Where is he?", ["South-East", "North-East", "South-West", "East"], "South-East", "He is east and south of the start."),
            _mcq(10, "A person walks north 5 m then east 5 m. Distance from start?", ["5 m", "7.07 m", "10 m", "12 m"], "7.07 m", "Use Pythagoras: sqrt(5^2 + 5^2) ≈ 7.07 m."),
        ],
        "hard": [
            _mcq(1, "A man walks 10 m north, 5 m east, 5 m south, 5 m west. Where is he?", ["5 m north", "At start", "5 m east", "5 m south"], "5 m north", "East-west cancel and 10 north minus 5 south leaves 5 m north."),
            _mcq(2, "A person walks 20 m east, 10 m north, 20 m west. Where is he?", ["10 m north", "10 m south", "At start", "20 m west"], "10 m north", "East-west cancel, leaving 10 m north."),
            _mcq(3, "A man walks north 10 m, east 5 m, south 10 m. Distance from start?", ["5 m", "10 m", "11.18 m", "15 m"], "5 m", "North and south cancel, leaving 5 m east."),
            _mcq(4, "A person walks east 10 m, north 10 m, west 10 m. Where is he?", ["10 m north", "At start", "10 m west", "10 m east"], "10 m north", "East and west cancel, leaving 10 m north."),
            _mcq(5, "A person walks north 5 m, east 5 m, south 5 m, west 5 m. Result?", ["At start", "5 m north", "5 m east", "5 m south"], "At start", "All movements cancel each other."),
            _mcq(6, "A man walks 15 m east then 10 m north. Distance?", ["15 m", "18.03 m", "20 m", "25 m"], "18.03 m", "Distance = sqrt(15^2 + 10^2) = sqrt(325) ≈ 18.03 m."),
            _mcq(7, "A person walks south 10 m, west 10 m, north 10 m. Where is he?", ["10 m west", "10 m east", "At start", "10 m north"], "10 m west", "North-south cancel, leaving 10 m west."),
            _mcq(8, "A man walks north, east, south, west same distance. Where is he?", ["At start", "North of start", "East of start", "Cannot say"], "At start", "Equal movements in opposite directions cancel."),
            _mcq(9, "A person walks east 5 m then north 12 m. Distance?", ["12 m", "13 m", "14 m", "17 m"], "13 m", "Distance = sqrt(5^2 + 12^2) = 13 m."),
            _mcq(10, "A person walks 8 m north then 15 m east. Distance?", ["15 m", "17 m", "19 m", "23 m"], "17 m", "Distance = sqrt(8^2 + 15^2) = 17 m."),
        ],
    }
    return question_bank[difficulty]


def _build_seating_arrangement(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "A, B, C sit in a row as A-B-C. Who sits in middle?", ["A", "B", "C", "Cannot say"], "B", "In A-B-C, B is in the middle."),
            _mcq(2, "A sits left of B. Who is on the right?", ["A", "B", "Both", "Cannot say"], "B", "If A is left of B, B is to the right."),
            _mcq(3, "A sits between B and C. Who is in middle?", ["A", "B", "C", "Cannot say"], "A", "The one sitting between two others is in the middle."),
            _mcq(4, "B sits right of A. Who is on the left?", ["A", "B", "Both", "Cannot say"], "A", "If B is right of A, A is left."),
            _mcq(5, "C sits left of B. Who is on the right?", ["A", "B", "C", "Cannot say"], "B", "If C is left of B, B is to the right."),
            _mcq(6, "A sits next to B. Who are neighbors?", ["A and B", "A and C", "B and C", "Cannot say"], "A and B", "They are adjacent, so they are neighbors."),
            _mcq(7, "B sits between A and C. Who are at the ends?", ["A and B", "B and C", "A and C", "Cannot say"], "A and C", "If B is between A and C, then A and C are at the ends."),
            _mcq(8, "A sits rightmost in a row of A, B, C as B-C-A. Who is leftmost?", ["A", "B", "C", "Cannot say"], "B", "In B-C-A, B is leftmost."),
            _mcq(9, "C sits leftmost in a row C-A-B. Who is rightmost?", ["A", "B", "C", "Cannot say"], "B", "In C-A-B, B is rightmost."),
            _mcq(10, "B sits in middle in row A-B-C. Who are on the sides?", ["A and B", "B and C", "A and C", "Cannot say"], "A and C", "A and C are on the two sides of B."),
        ],
        "medium": [
            _mcq(1, "A, B, C, D sit in a row. A is left of B and C is right of B. Who is in the middle among A, B, C?", ["A", "B", "C", "D"], "B", "A-B-C places B in the middle."),
            _mcq(2, "P, Q, R, S sit in a circle in order P-Q-R-S. P is opposite R. Who is next to Q?", ["P and R", "R and S", "P and S", "Only P"], "P and R", "In the circle, Q is adjacent to P and R."),
            _mcq(3, "In a row of four seats, A sits second from left. Who is to A's immediate left?", ["Seat 1 occupant", "Seat 3 occupant", "Seat 4 occupant", "No one"], "Seat 1 occupant", "Second from left means one seat is immediately left of A."),
            _mcq(4, "In a row of five seats, B sits third from right. What is B's position from the left?", ["First", "Second", "Third", "Fourth"], "Third", "In 5 seats, third from right equals third from left."),
            _mcq(5, "C sits between A and D. Who are C's neighbors?", ["A and D", "B and D", "A and B", "Cannot say"], "A and D", "The two adjacent people to C are A and D."),
            _mcq(6, "P sits left of Q. R sits right of Q. What is the arrangement?", ["P-Q-R", "Q-P-R", "R-Q-P", "P-R-Q"], "P-Q-R", "Q is between P on left and R on right."),
            _mcq(7, "A and B sit opposite each other in a circle of four seats. Who can sit next to A?", ["Any of the other two", "Only B", "No one", "Only one fixed person"], "Any of the other two", "The two remaining seats are adjacent to A."),
            _mcq(8, "Four people sit in a row facing north. Which position is called the center in a row of four?", ["1st and 4th", "2nd and 3rd", "Only 2nd", "Only 3rd"], "2nd and 3rd", "In an even row, the two middle seats are 2nd and 3rd."),
            _mcq(9, "Five people sit in a row. Which seat is the middle one?", ["1st", "2nd", "3rd", "4th"], "3rd", "In a row of five, the 3rd seat is the center."),
            _mcq(10, "Six people sit in a circle. Which seat is opposite a person?", ["1 seat away", "2 seats away", "3 seats away", "4 seats away"], "3 seats away", "In a six-person circle, the opposite seat is three positions away."),
        ],
        "hard": [
            _mcq(1, "Eight people sit in a circle facing center. A is opposite B. C is immediately left of A. Who is immediately right of B?", ["C", "A", "Cannot be determined", "The person opposite C"], "The person opposite C", "In a centered circle, left and right reverse across the opposite side; the seat right of B is opposite to the seat left of A."),
            _mcq(2, "Six people sit in a row. A is second from left, B is third from right. Which positions are the middle seats?", ["2 and 5", "3 and 4", "1 and 6", "2 and 4"], "3 and 4", "In a row of six, the middle seats are always 3 and 4."),
            _mcq(3, "Eight sit in a circle. D is opposite E. F sits next to D. Who is left of E?", ["Cannot be determined", "F", "D", "The person opposite F"], "Cannot be determined", "Knowing F is next to D does not fix whether F is left or right of D."),
            _mcq(4, "Five sit in a row. A is left of B and C is right of B. Who is center among A, B, C?", ["A", "B", "C", "Cannot be determined"], "B", "A-B-C places B in the center."),
            _mcq(5, "Seven sit in a circle facing center. Who is opposite A?", ["No exact opposite seat", "B", "C", "D"], "No exact opposite seat", "A circle with odd number of seats has no exact opposite seat."),
            _mcq(6, "Ten people sit in a row. Which seat is fifth from left?", ["Middle-left", "Exact center", "Second from right", "End seat"], "Middle-left", "In ten seats, 5th from left is one of the two middle-near seats and is the middle-left seat."),
            _mcq(7, "Eight sit in a circle facing outward. Who is left of A?", ["The clockwise neighbor", "The anticlockwise neighbor", "Opposite person", "Cannot say"], "The clockwise neighbor", "When facing outward, left is clockwise."),
            _mcq(8, "Six sit in a row. A is not at an end, B is in a middle seat. Who can sit next to B?", ["Either adjacent seat occupant", "Only A", "No one", "Only one fixed person"], "Either adjacent seat occupant", "A middle seat always has two neighbors."),
            _mcq(9, "Nine sit in a circle. Who is opposite C?", ["No exact opposite seat", "D", "E", "F"], "No exact opposite seat", "An odd circle does not have an exact opposite position."),
            _mcq(10, "Eight sit in a circle alternating gender. Who is next to a woman?", ["Only women", "Only men", "One man and one woman", "Cannot say"], "Only men", "With alternating genders, each woman's neighbors are men."),
        ],
    }
    return question_bank[difficulty]


def _build_puzzles(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Three boxes are Red, Blue, and Green. Apple is not in Red or Green. Which box has the apple?", ["Red", "Blue", "Green", "Cannot say"], "Blue", "If apple is not in Red or Green, it must be in Blue."),
            _mcq(2, "Three friends Anu, Balu, and Charan drink tea, coffee, and milk. Anu does not drink tea, Balu does not drink milk, and Charan drinks coffee. Who drinks tea?", ["Anu", "Balu", "Charan", "Cannot say"], "Balu", "Charan drinks coffee, so Anu and Balu take tea/milk. Since Anu does not drink tea, Balu drinks tea."),
            _mcq(3, "Three houses A, B, C are occupied by Ravi, Sita, and Manoj. Ravi does not live in A, Sita lives in C. Who lives in B?", ["Ravi", "Sita", "Manoj", "Cannot say"], "Ravi", "If Sita is in C and Ravi not in A, Ravi must be in B."),
            _mcq(4, "Three cars Red, Blue, and Black are owned by Kiran, Lata, and Mohan. Kiran does not own Red, Lata owns Blue. Who owns Black?", ["Kiran", "Lata", "Mohan", "Cannot say"], "Kiran", "Lata has Blue. Kiran cannot have Red, so Kiran has Black."),
            _mcq(5, "A trip is on Monday, Tuesday, or Wednesday. It is not on Monday or Wednesday. Which day is it?", ["Monday", "Tuesday", "Wednesday", "Cannot say"], "Tuesday", "Only Tuesday remains."),
            _mcq(6, "Three animals dog, cat, rabbit are in three cages. Rabbit is not in cage 1 or 2. Which cage is rabbit in?", ["1", "2", "3", "Cannot say"], "3", "Only cage 3 remains."),
            _mcq(7, "Three fruits apple, banana, mango are in baskets 1, 2, 3. Mango is not in 1, banana is in 3. Which basket has apple?", ["1", "2", "3", "Cannot say"], "1", "If banana is in 3 and mango not in 1, mango must be in 2, so apple is in 1."),
            _mcq(8, "Three subjects Math, Science, English are liked by A, B, C. A likes Math, B does not like English. Who likes Science if each likes one different subject?", ["A", "B", "C", "Cannot say"], "B", "A takes Math. B cannot take English, so B takes Science."),
            _mcq(9, "Three sports cricket, football, tennis are played by P, Q, R. P plays cricket, R does not play tennis. Who plays football?", ["P", "Q", "R", "Cannot say"], "R", "P takes cricket. R cannot take tennis, so R plays football."),
            _mcq(10, "Three jobs teacher, doctor, engineer are held by X, Y, Z. X is doctor, Z is not engineer. Who is teacher?", ["X", "Y", "Z", "Cannot say"], "Z", "X is doctor. Z cannot be engineer, so Z is teacher."),
        ],
        "medium": [
            _mcq(1, "Four friends A, B, C, D choose colors Red, Blue, Green, Yellow. A does not choose Red, B chooses Blue, C does not choose Green or Yellow. Which color does C choose?", ["Red", "Blue", "Green", "Yellow"], "Red", "B is Blue. C cannot be Green or Yellow, so only Red fits."),
            _mcq(2, "Four people drink Tea, Coffee, Milk, Juice. P drinks Tea, Q does not drink Coffee, R drinks Juice. What does S drink?", ["Tea", "Coffee", "Milk", "Juice"], "Coffee", "Tea and Juice are taken. If Q does not drink Coffee, Q must drink Milk, so S drinks Coffee."),
            _mcq(3, "Four students study Math, Physics, Biology, History. Arun studies Math, Bina does not study Biology, Chetan studies History. What does Deepa study?", ["Math", "Physics", "Biology", "History"], "Biology", "Math and History are taken. If Bina does not study Biology, she studies Physics, so Deepa studies Biology."),
            _mcq(4, "Four travelers use Bus, Train, Flight, Car. Nisha uses Train, Om does not use Car, Pooja uses Flight. What does Ravi use?", ["Bus", "Train", "Flight", "Car"], "Car", "Train and Flight are taken. Om cannot use Car, so Om uses Bus and Ravi uses Car."),
            _mcq(5, "Four flowers Rose, Lily, Lotus, Jasmine are chosen by A, B, C, D. A chooses Rose, B does not choose Jasmine, C chooses Lily. What does D choose?", ["Rose", "Lily", "Lotus", "Jasmine"], "Jasmine", "Rose and Lily are taken. B cannot take Jasmine, so B takes Lotus and D takes Jasmine."),
            _mcq(6, "Four animals Lion, Tiger, Deer, Zebra are in enclosures 1-4. Lion is in 1, Tiger not in 4, Deer in 3. Which enclosure has Zebra?", ["1", "2", "3", "4"], "4", "Lion is in 1 and Deer in 3. Tiger cannot be 4, so Tiger is 2 and Zebra is 4."),
            _mcq(7, "Four metals Gold, Silver, Iron, Copper are assigned to P, Q, R, S. P has Gold, Q does not have Copper, R has Iron. What does S have?", ["Gold", "Silver", "Iron", "Copper"], "Copper", "Gold and Iron are taken. If Q cannot have Copper, Q has Silver, so S has Copper."),
            _mcq(8, "Four seasons Winter, Summer, Rainy, Spring are assigned to W, X, Y, Z. W gets Winter, X not Spring, Y gets Rainy. What does Z get?", ["Winter", "Summer", "Rainy", "Spring"], "Spring", "Winter and Rainy are fixed. X cannot be Spring, so X gets Summer and Z gets Spring."),
            _mcq(9, "Four shapes Circle, Square, Triangle, Rectangle are drawn by A, B, C, D. A draws Circle, B does not draw Square, C draws Triangle. What does D draw?", ["Circle", "Square", "Triangle", "Rectangle"], "Square", "Circle and Triangle are fixed. B cannot draw Square, so B draws Rectangle and D draws Square."),
            _mcq(10, "Four cities Delhi, Mumbai, Chennai, Kolkata are visited by P, Q, R, S. P visits Delhi, R visits Chennai, Q does not visit Kolkata. Which city does S visit?", ["Delhi", "Mumbai", "Chennai", "Kolkata"], "Kolkata", "Delhi and Chennai are fixed. Q cannot visit Kolkata, so Q visits Mumbai and S visits Kolkata."),
        ],
        "hard": [
            _mcq(1, "Five people A, B, C, D, E choose 1 to 5. A is not 1, B is 2, C is not 3 or 4, D is 5. Which number does C choose?", ["1", "2", "3", "4"], "1", "B takes 2 and D takes 5. C cannot take 3 or 4, so C must take 1."),
            _mcq(2, "Five friends choose Soda, Coffee, Tea, Juice, Milk. P chooses Coffee, Q not Tea, R chooses Juice, S not Milk or Soda. What does S choose?", ["Coffee", "Tea", "Juice", "Milk"], "Tea", "Coffee and Juice are taken. S cannot take Milk or Soda, so S takes Tea."),
            _mcq(3, "Five subjects Math, Physics, Chemistry, Biology, English are chosen by A, B, C, D, E. A chooses Math, B not Chemistry, C chooses Biology, D not English. What does E choose if all differ?", ["Physics", "Chemistry", "Biology", "English"], "Chemistry", "Math and Biology are fixed. D not English leaves D as Physics, B as English, so E gets Chemistry."),
            _mcq(4, "Six people travel by Bus, Car, Train, Flight, Bike, Metro. A uses Bus, B not Car, C uses Flight, D not Metro, E uses Train. What does F use if B uses Bike and D uses Car?", ["Metro", "Car", "Bike", "Train"], "Metro", "Bus, Flight, Train, Bike, and Car are taken, so F uses Metro."),
            _mcq(5, "Five houses use Red, Blue, Green, Yellow, White paint. House A is Red, B not Blue, C is Green, D not Yellow, E not White. Which color is E?", ["Blue", "Yellow", "White", "Red"], "Blue", "Red and Green are fixed. If D not Yellow and E not White, D takes White and E takes Blue."),
            _mcq(6, "Six players choose Cricket, Football, Tennis, Hockey, Chess, Badminton. A chooses Cricket, B not Chess, C chooses Tennis, D chooses Hockey, E not Football. What does F choose if B chooses Football and E chooses Chess?", ["Badminton", "Football", "Chess", "Tennis"], "Badminton", "Cricket, Tennis, Hockey, Football, and Chess are taken, so F gets Badminton."),
            _mcq(7, "Five jobs Teacher, Doctor, Engineer, Lawyer, Pilot are chosen by P, Q, R, S, T. P is Teacher, Q not Engineer, R is Lawyer, S not Pilot. What does T do if Q is Doctor and S is Engineer?", ["Teacher", "Doctor", "Pilot", "Lawyer"], "Pilot", "Teacher, Doctor, Lawyer, and Engineer are used, so T is Pilot."),
            _mcq(8, "Six boxes contain Apple, Banana, Mango, Orange, Grapes, Guava. Box 1 has Apple, Box 2 not Banana, Box 3 has Mango, Box 4 not Orange, Box 5 has Grapes. What is in Box 6 if Box 2 has Orange and Box 4 has Banana?", ["Guava", "Apple", "Banana", "Orange"], "Guava", "Apple, Mango, Grapes, Orange, and Banana are taken, leaving Guava."),
            _mcq(9, "Five students live in Delhi, Mumbai, Chennai, Pune, Jaipur. A lives in Delhi, B not Pune, C in Chennai, D not Jaipur. Where does E live if B lives in Mumbai and D lives in Pune?", ["Jaipur", "Delhi", "Mumbai", "Chennai"], "Jaipur", "Delhi, Mumbai, Chennai, and Pune are occupied, so E lives in Jaipur."),
            _mcq(10, "Six people choose numbers 10, 20, 30, 40, 50, 60. A takes 10, B not 20, C takes 30, D takes 40, E not 50. What does F take if B takes 50 and E takes 20?", ["60", "50", "30", "20"], "60", "10, 20, 30, 40, and 50 are taken, so F gets 60."),
        ],
    }
    return question_bank[difficulty]


def _build_pattern_recognition(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Find the next symbol: △ ○ △ ○ ?", ["△", "○", "□", "☆"], "△", "The pattern alternates △ and ○."),
            _mcq(2, "Find the next pattern: AB AB AB ?", ["AB", "BA", "AA", "BB"], "AB", "The block AB repeats."),
            _mcq(3, "Find the next number: 1 2 1 2 ?", ["1", "2", "3", "4"], "1", "The pattern alternates 1 and 2."),
            _mcq(4, "Find the next letters: X Y X Y ?", ["X", "Y", "Z", "W"], "X", "The pattern alternates X and Y."),
            _mcq(5, "Find the next symbol: ★ ☆ ★ ☆ ?", ["★", "☆", "△", "○"], "★", "The pattern alternates ★ and ☆."),
            _mcq(6, "Find the next letters: A B C A B ?", ["A", "B", "C", "D"], "C", "A-B-C repeats."),
            _mcq(7, "Find the next color: Red Blue Red Blue ?", ["Red", "Blue", "Green", "Yellow"], "Red", "The pattern alternates Red and Blue."),
            _mcq(8, "Find the next numbers: 1 3 1 3 ?", ["1", "2", "3", "4"], "1", "The pattern alternates 1 and 3."),
            _mcq(9, "Find the next letters: M N M N ?", ["M", "N", "O", "L"], "M", "The pattern alternates M and N."),
            _mcq(10, "Find the next shape: Circle Square Circle ?", ["Circle", "Square", "Triangle", "Rectangle"], "Square", "The pattern alternates Circle and Square."),
        ],
        "medium": [
            _mcq(1, "Find the next letter: A C E G ?", ["H", "I", "J", "K"], "I", "Letters increase by 2 positions."),
            _mcq(2, "Find the next number: 2 4 6 8 ?", ["9", "10", "12", "14"], "10", "The series increases by 2."),
            _mcq(3, "Find the next letter: Z X V T ?", ["R", "S", "Q", "P"], "R", "Letters move backward by 2."),
            _mcq(4, "Find the next number: 1 4 9 16 ?", ["20", "24", "25", "36"], "25", "These are squares: 1^2, 2^2, 3^2, 4^2."),
            _mcq(5, "Find the next letter: B D F H ?", ["I", "J", "K", "L"], "J", "Letters increase by 2 positions."),
            _mcq(6, "Find the next number: 3 6 12 24 ?", ["36", "42", "48", "54"], "48", "Each term is doubled."),
            _mcq(7, "Find the next letter: C F I L ?", ["N", "O", "P", "Q"], "O", "Letters increase by 3 positions."),
            _mcq(8, "Find the next number: 5 10 20 40 ?", ["60", "70", "80", "90"], "80", "Each term is doubled."),
            _mcq(9, "Find the next letter: A D G J ?", ["K", "L", "M", "N"], "M", "Letters increase by 3 positions."),
            _mcq(10, "Find the next number: 2 5 8 11 ?", ["12", "13", "14", "15"], "14", "The series increases by 3."),
        ],
        "hard": [
            _mcq(1, "Find the next number: 1 3 6 10 15 ?", ["18", "20", "21", "22"], "21", "Differences are +2, +3, +4, +5, so next is +6."),
            _mcq(2, "Find the next number: 2 6 7 21 22 ?", ["44", "46", "66", "67"], "66", "Pattern alternates ×3, +1: 2×3=6, +1=7, ×3=21, +1=22, so next is 66."),
            _mcq(3, "Find the next number: 4 6 9 6 14 ?", ["6", "9", "14", "11"], "6", "Odd positions 4, 9, 14 increase by 5; even positions stay 6."),
            _mcq(4, "Find the next number: 1 4 27 256 ?", ["625", "1296", "3125", "4096"], "3125", "Pattern is 1^1, 2^2, 3^3, 4^4, so next is 5^5."),
            _mcq(5, "Find the next number: 5 10 8 16 11 ?", ["18", "20", "22", "24"], "22", "Odd terms are 5, 8, 11 (+3) and even terms are 10, 16, 22 (+6)."),
            _mcq(6, "Find the next number: 7 14 28 56 ?", ["84", "98", "112", "120"], "112", "Each term is doubled."),
            _mcq(7, "Find the next number: 2 3 5 9 17 ?", ["25", "31", "33", "35"], "33", "Pattern is previous ×2 -1: 2→3, 3→5, 5→9, 9→17, so next is 33."),
            _mcq(8, "Find the next number: 1 2 6 24 120 ?", ["240", "360", "600", "720"], "720", "These are factorials: 1!, 2!, 3!, 4!, 5!, so next is 6! = 720."),
            _mcq(9, "Find the next number: 11 13 17 19 ?", ["21", "22", "23", "25"], "23", "These are consecutive prime numbers."),
            _mcq(10, "Find the next number: 1 3 7 15 31 ?", ["47", "55", "63", "65"], "63", "Pattern is previous ×2 +1."),
        ],
    }
    return question_bank[difficulty]


def _build_series(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Complete the series: 2 4 6 8 ?", ["9", "10", "11", "12"], "10", "The series increases by 2."),
            _mcq(2, "Complete the series: 5 10 15 20 ?", ["20", "25", "30", "35"], "25", "The series increases by 5."),
            _mcq(3, "Complete the series: A B C D ?", ["D", "E", "F", "G"], "E", "Letters move forward by 1."),
            _mcq(4, "Complete the series: Z Y X W ?", ["V", "U", "T", "S"], "V", "Letters move backward by 1."),
            _mcq(5, "Complete the series: 3 6 9 12 ?", ["14", "15", "16", "18"], "15", "The series increases by 3."),
            _mcq(6, "Complete the series: B C D E ?", ["F", "G", "H", "I"], "F", "Letters move forward by 1."),
            _mcq(7, "Complete the series: 1 3 5 7 ?", ["8", "9", "10", "11"], "9", "The series increases by 2."),
            _mcq(8, "Complete the series: 10 20 30 40 ?", ["45", "50", "55", "60"], "50", "The series increases by 10."),
            _mcq(9, "Complete the series: A C E G ?", ["H", "I", "J", "K"], "I", "Letters move forward by 2."),
            _mcq(10, "Complete the series: M N O P ?", ["Q", "R", "S", "T"], "Q", "Letters move forward by 1."),
        ],
        "medium": [
            _mcq(1, "Complete the series: 2 6 18 54 ?", ["108", "126", "144", "162"], "162", "Each term is multiplied by 3."),
            _mcq(2, "Complete the series: 3 9 27 81 ?", ["162", "243", "324", "405"], "243", "Each term is multiplied by 3."),
            _mcq(3, "Complete the series: 1 4 9 16 ?", ["20", "24", "25", "36"], "25", "These are square numbers."),
            _mcq(4, "Complete the series: A D G J ?", ["K", "L", "M", "N"], "M", "Letters move forward by 3."),
            _mcq(5, "Complete the series: B F J N ?", ["Q", "R", "S", "T"], "R", "Letters move forward by 4."),
            _mcq(6, "Complete the series: 5 7 11 13 ?", ["15", "16", "17", "19"], "17", "These are consecutive prime numbers after 5."),
            _mcq(7, "Complete the series: 1 2 4 7 11 ?", ["14", "15", "16", "17"], "16", "Differences are +1, +2, +3, +4, so next is +5."),
            _mcq(8, "Complete the series: Z V R N ?", ["J", "K", "L", "M"], "J", "Letters move backward by 4."),
            _mcq(9, "Complete the series: C G K O ?", ["Q", "R", "S", "T"], "S", "Letters move forward by 4."),
            _mcq(10, "Complete the series: 8 16 24 32 ?", ["36", "40", "44", "48"], "40", "The series increases by 8."),
        ],
        "hard": [
            _mcq(1, "Complete the series: 2 3 5 9 17 ?", ["25", "31", "33", "35"], "33", "Pattern is previous ×2 -1."),
            _mcq(2, "Complete the series: 1 4 27 256 ?", ["625", "1296", "3125", "4096"], "3125", "Pattern is 1^1, 2^2, 3^3, 4^4, so next is 5^5."),
            _mcq(3, "Complete the series: 3 6 7 14 15 ?", ["28", "30", "32", "34"], "30", "Pattern alternates ×2, +1."),
            _mcq(4, "Complete the series: 1 2 6 24 120 ?", ["240", "360", "600", "720"], "720", "These are factorials."),
            _mcq(5, "Complete the series: 2 5 10 17 26 ?", ["35", "37", "39", "41"], "37", "Differences are +3, +5, +7, +9, so next is +11."),
            _mcq(6, "Complete the series: A C F J O ?", ["R", "S", "T", "U"], "U", "Letter jumps are +2, +3, +4, +5, so next is +6."),
            _mcq(7, "Complete the series: 11 13 17 19 ?", ["21", "22", "23", "25"], "23", "These are consecutive prime numbers."),
            _mcq(8, "Complete the series: 4 9 16 25 ?", ["30", "34", "36", "49"], "36", "These are squares: 2^2, 3^2, 4^2, 5^2, so next is 6^2."),
            _mcq(9, "Complete the series: 7 10 8 11 9 ?", ["10", "11", "12", "13"], "12", "Two interleaved series: 7,8,9 and 10,11,12."),
            _mcq(10, "Complete the series: B E I N T ?", ["X", "Y", "Z", "A"], "A", "Letter jumps are +3, +4, +5, +6, so next is +7 from T which wraps to A."),
        ],
    }
    return question_bank[difficulty]


def _build_reading_comprehension(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Passage: 'Mimi is a small cat. She loves to drink milk and sleep on a soft mat.' What does the cat like?", ["Milk", "Running", "Fish market", "Rain"], "Milk", "The passage says Mimi loves to drink milk."),
            _mcq(2, "Passage: 'Rohan wakes up at 6 AM every day. He brushes his teeth and goes for a walk.' What time does he wake up?", ["5 AM", "6 AM", "7 AM", "8 AM"], "6 AM", "The passage clearly says he wakes up at 6 AM."),
            _mcq(3, "Passage: 'In Class 5, Mrs. Meena teaches English. The students enjoy her stories.' Who is the teacher?", ["Rohan", "Mrs. Meena", "Class 5", "English"], "Mrs. Meena", "Mrs. Meena is named as the teacher."),
            _mcq(4, "Passage: 'People visited the market to buy fruits, vegetables, and flowers.' What do people buy?", ["Books", "Fruits and vegetables", "Cars", "Furniture"], "Fruits and vegetables", "The passage says people buy fruits, vegetables, and flowers."),
            _mcq(5, "Passage: 'Tommy is a brown dog. He lives in a kennel near the garden.' Where does the dog live?", ["In a school", "In a kennel", "In a shop", "In a pond"], "In a kennel", "The passage says Tommy lives in a kennel."),
            _mcq(6, "Passage: 'Today the weather is cool and pleasant. The temperature is 22 degrees Celsius.' What is the temperature?", ["18°C", "20°C", "22°C", "25°C"], "22°C", "The passage mentions 22 degrees Celsius."),
            _mcq(7, "Passage: 'People decorated their homes with lamps and enjoyed sweets during Diwali.' Which festival is described?", ["Holi", "Eid", "Diwali", "Pongal"], "Diwali", "Lamps and sweets point to Diwali."),
            _mcq(8, "Passage: 'Anita went to Chennai by train to visit her grandmother.' How did the person travel?", ["By bus", "By car", "By train", "By plane"], "By train", "The passage says Anita went by train."),
            _mcq(9, "Passage: 'Vikram loves painting in his free time. He uses bright colors to make nature scenes.' What hobby is mentioned?", ["Singing", "Painting", "Dancing", "Reading"], "Painting", "The passage mentions painting as the hobby."),
            _mcq(10, "Passage: 'In the family, grandfather Raju is 78 years old. Everyone respects him.' Who is the eldest member?", ["Raju", "Mother", "Brother", "Child"], "Raju", "Grandfather Raju is identified as the eldest."),
        ],
        "medium": [
            _mcq(1, "Passage: 'Factories release smoke into the air and vehicles produce harmful gases. These are major causes of pollution.' What is a cause of pollution?", ["Trees", "Factories and vehicles", "Rain", "Rivers"], "Factories and vehicles", "The passage directly mentions factories and vehicles."),
            _mcq(2, "Passage: 'Schools now use smart boards and tablets to make lessons more interactive.' What technology is used?", ["Typewriters", "Smart boards and tablets", "Projectors only", "Television"], "Smart boards and tablets", "The passage names smart boards and tablets."),
            _mcq(3, "Passage: 'Rina could not lift the box alone, so Karan helped her carry it.' Who helped whom?", ["Rina helped Karan", "Karan helped Rina", "Both ignored each other", "Teacher helped both"], "Karan helped Rina", "The passage says Karan helped Rina carry the box."),
            _mcq(4, "Passage: 'Wildlife conservation is important because many animals are losing their natural homes and some are becoming extinct.' Why is it important?", ["To build zoos", "To save animals from extinction", "To cut forests", "To increase traffic"], "To save animals from extinction", "The passage says animals are losing homes and becoming extinct."),
            _mcq(5, "Passage: 'Global warming causes melting glaciers, rising sea levels, and irregular rainfall.' Which effect is mentioned?", ["Lower sea levels", "Melting glaciers", "More snow everywhere", "Fewer clouds"], "Melting glaciers", "The passage directly mentions melting glaciers."),
            _mcq(6, "Passage: 'Asha entered the room first. Then Rahul spoke to the manager. Finally, Neha wrote the note.' Who acted first?", ["Rahul", "Neha", "Asha", "Manager"], "Asha", "The passage says Asha entered first."),
            _mcq(7, "Passage: 'India became independent in the year 1947 after a long freedom struggle.' What is the year of the event?", ["1935", "1942", "1947", "1950"], "1947", "The passage states the event happened in 1947."),
            _mcq(8, "Passage: 'Doctors advise people to drink water regularly and exercise daily to stay healthy.' Which habit is suggested?", ["Skipping meals", "Drinking water regularly", "Sleeping late", "Avoiding movement"], "Drinking water regularly", "The passage specifically suggests drinking water regularly."),
            _mcq(9, "Passage: 'In the final race, Nisha crossed the line before everyone else and won the gold medal.' Who won?", ["Riya", "Nisha", "Coach", "No one"], "Nisha", "The passage says Nisha won the gold medal."),
            _mcq(10, "Passage: 'Among bicycle, bus, and airplane, the airplane is the fastest mode of transportation.' Which mode is fastest?", ["Bicycle", "Bus", "Airplane", "Train"], "Airplane", "The passage directly states airplane is the fastest."),
        ],
        "hard": [
            _mcq(1, "Passage: 'GDP is the total value of goods and services produced within a country in a given period.' What is GDP?", ["Government debt", "Total value of goods and services produced", "Public savings only", "Import tax"], "Total value of goods and services produced", "The passage defines GDP directly."),
            _mcq(2, "Passage: 'Climate change is caused mainly by greenhouse gas emissions, deforestation, and industrial pollution.' What are the main causes?", ["Rain and wind", "Greenhouse gases, deforestation, and pollution", "Only earthquakes", "Only sea waves"], "Greenhouse gases, deforestation, and pollution", "The passage lists these three causes."),
            _mcq(3, "Passage: 'Though the village looked peaceful, the writer described its silence as heavy and unsettling.' What is the author's tone?", ["Joyful", "Humorous", "Uneasy", "Careless"], "Uneasy", "Words like 'heavy' and 'unsettling' suggest an uneasy tone."),
            _mcq(4, "Passage: 'Artificial intelligence helps automate tasks and improve accuracy, but it also raises concerns about job loss and privacy.' What are the benefits and risks?", ["Only risks", "Automation and accuracy; job loss and privacy", "Only benefits", "No risks"], "Automation and accuracy; job loss and privacy", "The passage gives both benefits and risks explicitly."),
            _mcq(5, "Passage: 'Ravi tried to stop the team while Meena encouraged everyone to continue. His actions created the conflict.' Who is the antagonist?", ["Meena", "Ravi", "Everyone", "No one"], "Ravi", "The antagonist is the one creating conflict, which is Ravi here."),
            _mcq(6, "Passage: 'The article suggests improving education and job opportunities to reduce the social problem.' What solution is suggested?", ["Ignoring the issue", "Improving education and jobs", "Raising prices", "Closing schools"], "Improving education and jobs", "The passage directly recommends education and job opportunities."),
            _mcq(7, "Passage: 'The cultural event brought together old traditions and younger artists, helping the community remember its roots.' Why was the event important?", ["It made tickets expensive", "It helped preserve cultural roots", "It closed the town hall", "It reduced holidays"], "It helped preserve cultural roots", "The passage says it helped the community remember its roots."),
            _mcq(8, "Passage: 'The writer first supports online learning for flexibility, then notes its limits, and finally argues for a balanced approach.' What is the conclusion?", ["Online learning should end", "Only classrooms matter", "A balanced approach is best", "Technology is useless"], "A balanced approach is best", "The passage ends by favoring balance."),
            _mcq(9, "Passage: 'After repeated experiments, the scientist concluded that the new material could store energy more efficiently.' What did the scientist conclude?", ["The material was useless", "The material stores energy efficiently", "The experiment failed", "The material changes color"], "The material stores energy efficiently", "That is the scientist's final conclusion in the passage."),
            _mcq(10, "Passage: 'Heavy taxes angered the people, which led to protests. These protests later grew into a larger revolt.' What is the cause-effect relationship?", ["Taxes caused protests, which led to revolt", "Revolt caused taxes", "People avoided protests", "No link is shown"], "Taxes caused protests, which led to revolt", "The passage clearly links taxes to protests and protests to revolt."),
        ],
    }
    return question_bank[difficulty]


def _build_error_detection(difficulty):
    question_bank = {
        "easy": [
            ("She go to school every day.", "She goes to school every day."),
            ("He are a good player.", "He is a good player."),
            ("They has finished the work.", "They have finished the work."),
            ("I is happy today.", "I am happy today."),
            ("She play football well.", "She plays football well."),
            ("The dog bark loudly.", "The dog barks loudly."),
            ("He go to market yesterday.", "He went to market yesterday."),
            ("She don't like tea.", "She doesn't like tea."),
            ("They was at home.", "They were at home."),
            ("He not know the answer.", "He does not know the answer."),
        ],
        "medium": [
            ("She didn't went to school.", "She didn't go to school."),
            ("He are going to office.", "He is going to office."),
            ("They has been waiting for hours.", "They have been waiting for hours."),
            ("I have saw that movie.", "I have seen that movie."),
            ("She don't knows the truth.", "She doesn't know the truth."),
            ("The cat chase the mouse.", "The cat chases the mouse."),
            ("He was go to park.", "He went to park."),
            ("She has wrote a letter.", "She has written a letter."),
            ("They is happy.", "They are happy."),
            ("He not finished work yet.", "He has not finished work yet."),
        ],
        "hard": [
            ("Neither of them have completed the task.", "Neither of them has completed the task."),
            ("The data is not accurate.", "The data are not accurate."),
            ("He is one of those students who is always punctual.", "He is one of those students who are always punctual."),
            ("If I was you, I will apologize.", "If I were you, I would apologize."),
            ("The number of students are increasing.", "The number of students is increasing."),
            ("He demanded that she pays him.", "He demanded that she pay him."),
            ("Either Ram or Shyam are responsible.", "Either Ram or Shyam is responsible."),
            ("The committee have decided to meet tomorrow.", "The committee has decided to meet tomorrow."),
            ("Each of the boys have completed their homework.", "Each of the boys has completed their homework."),
            ("I wish I was taller.", "I wish I were taller."),
        ],
    }
    return [
        _mcq(idx + 1, "Choose the sentence with the grammatical error.", [wrong, right, "Both are correct", "No error"], wrong, f"The correct sentence is: {right}")
        for idx, (wrong, right) in enumerate(question_bank[difficulty])
    ]


def _build_sentence_correction(difficulty):
    question_bank = {
        "easy": [
            ("She go to school", "She goes to school."),
            ("He are my friend", "He is my friend."),
            ("They is happy", "They are happy."),
            ("I am like ice cream", "I like ice cream."),
            ("She play cricket", "She plays cricket."),
            ("He do homework", "He does homework."),
            ("She has wrote a letter", "She has written a letter."),
            ("I am agree", "I agree."),
            ("They was at home", "They were at home."),
            ("He don't like tea", "He doesn't like tea."),
        ],
        "medium": [
            ("If I was you", "If I were you."),
            ("He insisted that she goes", "He insisted that she go."),
            ("The number of cars are increasing", "The number of cars is increasing."),
            ("He demanded that she pays", "He demanded that she pay."),
            ("Neither of them have completed", "Neither of them has completed."),
            ("Each of the girls were present", "Each of the girls was present."),
            ("She is one of those who does work hard", "She is one of those who do work hard."),
            ("If he will come", "If he comes."),
            ("I wish I am taller", "I wish I were taller."),
            ("The data are reliable", "The data is reliable."),
        ],
        "hard": [
            ("No sooner had I reached than he lefts", "No sooner had I reached than he left."),
            ("Hardly had she entered when he started", "Hardly had she entered when he started."),
            ("Seldom we see such talent", "Seldom do we see such talent."),
            ("Only after he left, we realized", "Only after he left did we realize."),
            ("Scarcely had he spoken when the bell rings", "Scarcely had he spoken when the bell rang."),
            ("Little do they know", "Little do they know."),
            ("Not only he is smart", "Not only is he smart."),
            ("Rarely does one see", "Rarely does one see."),
            ("Such was the man that he inspires", "Such was the man who inspires."),
            ("No sooner the train arrived", "No sooner had the train arrived."),
        ],
    }
    return [
        _mcq(idx + 1, f"Choose the best correction for: '{wrong}'", [right, wrong, "No correction needed", "Both are correct"], right, "This is the grammatically correct form.")
        for idx, (wrong, right) in enumerate(question_bank[difficulty])
    ]


def _build_synonyms_antonyms(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Choose the antonym of 'Big'.", ["Large", "Huge", "Small", "Wide"], "Small", "'Small' is the opposite of 'Big'."),
            _mcq(2, "Choose the synonym of 'Small'.", ["Tiny", "Giant", "Long", "Wide"], "Tiny", "'Tiny' is similar in meaning to 'Small'."),
            _mcq(3, "Choose the synonym of 'Happy'.", ["Joyful", "Sad", "Angry", "Weak"], "Joyful", "'Joyful' is similar in meaning to 'Happy'."),
            _mcq(4, "Choose the antonym of 'Sad'.", ["Upset", "Happy", "Low", "Tired"], "Happy", "'Happy' is the opposite of 'Sad'."),
            _mcq(5, "Choose the synonym of 'Fast'.", ["Quick", "Slow", "Late", "Lazy"], "Quick", "'Quick' is similar in meaning to 'Fast'."),
            _mcq(6, "Choose the antonym of 'Slow'.", ["Quick", "Lazy", "Late", "Heavy"], "Quick", "'Quick' is the opposite of 'Slow'."),
            _mcq(7, "Choose the synonym of 'Begin'.", ["Start", "Stop", "End", "Finish"], "Start", "'Start' is similar in meaning to 'Begin'."),
            _mcq(8, "Choose the antonym of 'End'.", ["Close", "Finish", "Begin", "Last"], "Begin", "'Begin' is the opposite of 'End'."),
            _mcq(9, "Choose the antonym of 'Hot'.", ["Warm", "Heat", "Cold", "Boiling"], "Cold", "'Cold' is the opposite of 'Hot'."),
            _mcq(10, "Choose the antonym of 'Cold'.", ["Cool", "Chilly", "Hot", "Ice"], "Hot", "'Hot' is the opposite of 'Cold'."),
        ],
        "medium": [
            _mcq(1, "Choose the synonym of 'Obvious'.", ["Clear", "Hidden", "Doubtful", "Faint"], "Clear", "'Clear' is similar in meaning to 'Obvious'."),
            _mcq(2, "Choose the synonym of 'Peculiar'.", ["Strange", "Common", "Simple", "Normal"], "Strange", "'Strange' is similar in meaning to 'Peculiar'."),
            _mcq(3, "Choose the synonym of 'Brave'.", ["Bold", "Fearful", "Lazy", "Silent"], "Bold", "'Bold' is similar in meaning to 'Brave'."),
            _mcq(4, "Choose the synonym of 'Clever'.", ["Smart", "Slow", "Weak", "Sad"], "Smart", "'Smart' is similar in meaning to 'Clever'."),
            _mcq(5, "Choose the antonym of 'Ancient'.", ["Old", "Past", "Modern", "Former"], "Modern", "'Modern' is the opposite of 'Ancient'."),
            _mcq(6, "Choose the antonym of 'Modern'.", ["Current", "New", "Ancient", "Latest"], "Ancient", "'Ancient' is the opposite of 'Modern'."),
            _mcq(7, "Choose the antonym of 'Honest'.", ["Truthful", "Sincere", "Dishonest", "Faithful"], "Dishonest", "'Dishonest' is the opposite of 'Honest'."),
            _mcq(8, "Choose the synonym of 'Fragile'.", ["Delicate", "Strong", "Hard", "Solid"], "Delicate", "'Delicate' is similar in meaning to 'Fragile'."),
            _mcq(9, "Choose the synonym of 'Rare'.", ["Uncommon", "Frequent", "Daily", "Usual"], "Uncommon", "'Uncommon' is similar in meaning to 'Rare'."),
            _mcq(10, "Choose the synonym of 'Silent'.", ["Quiet", "Loud", "Busy", "Angry"], "Quiet", "'Quiet' is similar in meaning to 'Silent'."),
        ],
        "hard": [
            _mcq(1, "Choose the meaning closest to 'Ephemeral'.", ["Temporary", "Permanent", "Loud", "Careful"], "Temporary", "'Ephemeral' means lasting for a short time."),
            _mcq(2, "Choose the meaning closest to 'Ubiquitous'.", ["Rare", "Present everywhere", "Dangerous", "Hidden"], "Present everywhere", "'Ubiquitous' means found everywhere."),
            _mcq(3, "Choose the meaning closest to 'Magnanimous'.", ["Generous", "Cruel", "Tiny", "Angry"], "Generous", "'Magnanimous' means very generous or noble."),
            _mcq(4, "Choose the meaning closest to 'Fastidious'.", ["Careless", "Very attentive to detail", "Talkative", "Weak"], "Very attentive to detail", "'Fastidious' means very careful about details."),
            _mcq(5, "Choose the meaning closest to 'Obfuscate'.", ["Clarify", "Confuse", "Support", "Praise"], "Confuse", "'Obfuscate' means to make something unclear."),
            _mcq(6, "Choose the meaning closest to 'Pernicious'.", ["Helpful", "Harmful", "Beautiful", "Short"], "Harmful", "'Pernicious' means very harmful."),
            _mcq(7, "Choose the meaning closest to 'Loquacious'.", ["Silent", "Talkative", "Sleepy", "Wise"], "Talkative", "'Loquacious' means very talkative."),
            _mcq(8, "Choose the meaning closest to 'Sycophant'.", ["Leader", "Flatterer", "Scientist", "Helper"], "Flatterer", "'Sycophant' means a person who flatters for gain."),
            _mcq(9, "Choose the meaning closest to 'Vindictive'.", ["Forgiving", "Revengeful", "Gentle", "Happy"], "Revengeful", "'Vindictive' means seeking revenge."),
            _mcq(10, "Choose the meaning closest to 'Acerbic'.", ["Sweet", "Sharp and bitter", "Quiet", "Plain"], "Sharp and bitter", "'Acerbic' means sharp or bitter in tone."),
        ],
    }
    return question_bank[difficulty]


def _build_para_jumbles(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Arrange logically: A. She opened the book. B. It was interesting. C. She started reading.", ["ABC", "ACB", "CAB", "BCA"], "ACB", "She opens the book, starts reading, then finds it interesting."),
            _mcq(2, "Arrange logically: A. I woke up. B. I had breakfast. C. I went to school.", ["ABC", "ACB", "BAC", "CAB"], "ABC", "Waking up comes before breakfast and school."),
            _mcq(3, "Arrange logically: A. He plays cricket. B. He loves the game. C. He practices daily.", ["BAC", "ABC", "ACB", "BCA"], "BAC", "Love for the game explains why he plays and practices."),
            _mcq(4, "Arrange logically: A. The sun rises. B. Birds start chirping. C. Morning begins.", ["ABC", "ACB", "CAB", "CBA"], "ACB", "The sun rises, birds chirp, and that marks the morning scene."),
            _mcq(5, "Arrange logically: A. I went to market. B. I bought vegetables. C. I cooked food.", ["ABC", "ACB", "BAC", "CAB"], "ABC", "Market visit comes before buying and then cooking."),
            _mcq(6, "Arrange logically: A. He studies daily. B. He is intelligent. C. He scores well.", ["ABC", "ACB", "BAC", "CAB"], "ACB", "Studying leads to scoring well, showing he is intelligent."),
            _mcq(7, "Arrange logically: A. I saw a movie. B. It was exciting. C. I enjoyed it.", ["ABC", "ACB", "BAC", "CAB"], "ABC", "First the movie is seen, then judged exciting, then enjoyed."),
            _mcq(8, "Arrange logically: A. The teacher entered. B. Students stood. C. Class began.", ["ABC", "ACB", "BAC", "CAB"], "ABC", "Teacher enters, students stand, then class begins."),
            _mcq(9, "Arrange logically: A. I met my friend. B. We went to park. C. We played football.", ["ABC", "ACB", "BAC", "CAB"], "ABC", "Meeting comes first, then going to the park, then playing."),
            _mcq(10, "Arrange logically: A. She cooked food. B. It was delicious. C. Everyone enjoyed.", ["ABC", "ACB", "BAC", "CAB"], "ABC", "Food is cooked, described as delicious, and then enjoyed."),
        ],
        "medium": [
            _mcq(1, "Arrange logically: A. People cut many trees. B. The climate gets affected. C. Forests become smaller. D. Animals lose homes.", ["ACDB", "ABCD", "CADB", "ADCB"], "ACDB", "Cutting trees reduces forests, animals lose homes, and climate is affected."),
            _mcq(2, "Arrange logically: A. Smoke rises from factories. B. Air becomes polluted. C. People face breathing problems. D. Pollution control is needed.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "Smoke leads to polluted air, then health issues, then the need for control."),
            _mcq(3, "Arrange logically: A. Drink enough water. B. Exercise regularly. C. Stay healthy. D. Eat balanced food.", ["ABDC", "ADBC", "DABC", "BADC"], "ABDC", "Healthy habits lead to staying healthy."),
            _mcq(4, "Arrange logically: A. A boy found a puppy. B. He took it home. C. He fed it milk. D. The puppy slept.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "The puppy is found, taken home, fed, then sleeps."),
            _mcq(5, "Arrange logically: A. The festival arrived. B. People decorated houses. C. They lit lamps. D. Everyone celebrated.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "Festival comes first, then decorations, lamps, and celebration."),
            _mcq(6, "Arrange logically: A. A girl saw a problem. B. She thought carefully. C. She found a solution. D. Everyone praised her.", ["ABCD", "ACBD", "BACD", "CBAD"], "ABCD", "Seeing the problem comes before thinking and solving it."),
            _mcq(7, "Arrange logically: A. We packed our bags. B. We boarded the bus. C. The journey began. D. We reached the hill station.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "Packing comes before boarding, journey, and arrival."),
            _mcq(8, "Arrange logically: A. The teacher opened the app. B. Students joined online. C. The lesson started. D. Doubts were discussed.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "App opening is followed by joining, class start, and discussion."),
            _mcq(9, "Arrange logically: A. The team made a plan. B. Members divided work. C. They finished the project. D. The teacher appreciated them.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "Planning and dividing work come before completion and appreciation."),
            _mcq(10, "Arrange logically: A. I woke up early. B. I cleaned my room. C. I finished homework. D. I relaxed in the evening.", ["ABCD", "ACBD", "BACD", "CABD"], "ABCD", "The daily routine naturally follows this order."),
        ],
        "hard": [
            _mcq(1, "Arrange logically: A. Heavy rain continued for hours. B. The river overflowed. C. Nearby villages were flooded. D. Rescue teams arrived. E. Families were moved to shelters.", ["ABCDE", "ABCED", "BACDE", "ACBDE"], "ABCED", "Rain causes overflow, then flooding, then families move, followed by rescue support."),
            _mcq(2, "Arrange logically: A. The old man found a letter. B. He read it silently. C. His eyes filled with tears. D. He remembered his friend. E. He kept the letter safely.", ["ABCDE", "ABDCE", "ABCED", "BACDE"], "ABDCE", "He finds the letter, reads it, remembers his friend, feels emotional, and then keeps it safely."),
            _mcq(3, "Arrange logically: A. The king imposed a tax. B. People became angry. C. They protested in the streets. D. The law was changed. E. Peace returned.", ["ABCDE", "ABCED", "BACDE", "ACBDE"], "ABCDE", "Tax causes anger, protest, change in law, and then peace."),
            _mcq(4, "Arrange logically: A. Maya entered the room. B. Arjun hid the file. C. Neha noticed the tension. D. Maya asked a question. E. Arjun stayed silent.", ["BACDE", "ABCDE", "ACBDE", "BCDAE"], "BACDE", "The file is hidden before Maya enters, then tension and questioning follow."),
            _mcq(5, "Arrange logically: A. Scientists collected samples. B. They tested them in the lab. C. Results showed unusual changes. D. A report was prepared. E. The findings were published.", ["ABCDE", "ABCED", "BACDE", "ACBDE"], "ABCDE", "Scientific work naturally goes from collection to testing to reporting to publication."),
            _mcq(6, "Arrange logically: A. The news broke in the morning. B. People shared it quickly online. C. Officials confirmed the details. D. Reporters reached the site. E. A detailed update was released.", ["ADBCE", "ABCDE", "ABDCE", "BACDE"], "ADBCE", "News breaks, reporters arrive, people share it, officials confirm, and then a full update is released."),
            _mcq(7, "Arrange logically: A. A new bill was proposed. B. Opposition leaders criticized it. C. Parliament debated the issue. D. Amendments were suggested. E. The bill was finally passed.", ["ABCDE", "ACBDE", "BACDE", "ABDCE"], "ABCDE", "Proposal leads to criticism, debate, amendments, and final passage."),
            _mcq(8, "Arrange logically: A. 'Where are you going?' asked Ravi. B. Meena smiled softly. C. She picked up her bag. D. 'To the library,' she replied. E. Ravi offered to join her.", ["BCDAE", "ABCDE", "CABDE", "BACDE"], "BCDAE", "She smiles, picks up her bag, Ravi asks, she replies, and then Ravi offers to join."),
            _mcq(9, "Arrange logically: A. Education shapes thinking. B. It builds confidence. C. Confident people make better decisions. D. Better decisions improve society. E. Therefore, education is powerful.", ["ABCDE", "ABCED", "BACDE", "ACBDE"], "ABCDE", "Each sentence builds the argument to the conclusion."),
            _mcq(10, "Arrange logically: A. The data was collected. B. It was compared across years. C. A trend became visible. D. The analyst interpreted the trend. E. A recommendation was made.", ["ABCDE", "ABCED", "BACDE", "ACBDE"], "ABCDE", "Analysis begins with collection and ends with recommendation."),
        ],
    }
    return question_bank[difficulty]


def _build_vocabulary(difficulty):
    question_bank = {
        "easy": [
            _mcq(1, "Choose the correct meaning of 'Cat'.", ["An animal", "A fruit", "A place", "A color"], "An animal", "'Cat' is an animal."),
            _mcq(2, "Choose the correct meaning of 'Dog'.", ["An animal", "A vegetable", "A vehicle", "A river"], "An animal", "'Dog' is an animal."),
            _mcq(3, "Choose the correct meaning of 'Eat'.", ["To consume food", "To sleep", "To run", "To draw"], "To consume food", "'Eat' means to consume food."),
            _mcq(4, "Choose the correct meaning of 'Run'.", ["To move fast", "To sit", "To hide", "To read"], "To move fast", "'Run' means to move fast."),
            _mcq(5, "Choose the correct meaning of 'Sleep'.", ["To rest", "To dance", "To shout", "To cook"], "To rest", "'Sleep' means to rest."),
            _mcq(6, "Choose the correct meaning of 'Big'.", ["Large", "Tiny", "Cold", "Late"], "Large", "'Big' means large."),
            _mcq(7, "Choose the correct meaning of 'Small'.", ["Tiny", "Huge", "Fast", "Deep"], "Tiny", "'Small' means tiny."),
            _mcq(8, "Choose the correct meaning of 'Hot'.", ["Warm", "Cold", "Soft", "Sweet"], "Warm", "'Hot' means warm."),
            _mcq(9, "Choose the correct meaning of 'Cold'.", ["Warm", "Cool", "Bright", "Heavy"], "Cool", "'Cold' means cool."),
            _mcq(10, "Choose the correct meaning of 'Good'.", ["Nice", "Bad", "Slow", "Weak"], "Nice", "'Good' means nice or positive."),
        ],
        "medium": [
            _mcq(1, "Choose the correct meaning of 'Courage'.", ["Bravery", "Fear", "Weakness", "Silence"], "Bravery", "'Courage' means bravery."),
            _mcq(2, "Choose the correct meaning of 'Wisdom'.", ["Knowledge and good judgment", "Anger", "Noise", "Speed"], "Knowledge and good judgment", "'Wisdom' means knowledge with good judgment."),
            _mcq(3, "Choose the correct meaning of 'Happiness'.", ["Joy", "Sadness", "Confusion", "Fear"], "Joy", "'Happiness' means joy."),
            _mcq(4, "Choose the correct meaning of 'Sadness'.", ["Sorrow", "Excitement", "Energy", "Hope"], "Sorrow", "'Sadness' means sorrow."),
            _mcq(5, "Choose the correct meaning of 'Journey'.", ["Trip", "Food", "Book", "Game"], "Trip", "'Journey' means trip."),
            _mcq(6, "Choose the correct meaning of 'Danger'.", ["Risk", "Safety", "Comfort", "Peace"], "Risk", "'Danger' means risk."),
            _mcq(7, "Choose the correct meaning of 'Skill'.", ["Ability", "Weakness", "Illness", "Silence"], "Ability", "'Skill' means ability."),
            _mcq(8, "Choose the correct meaning of 'Speed'.", ["Quickness", "Delay", "Weight", "Softness"], "Quickness", "'Speed' means quickness."),
            _mcq(9, "Choose the correct meaning of 'Strength'.", ["Power", "Fear", "Pain", "Loss"], "Power", "'Strength' means power."),
            _mcq(10, "Choose the correct meaning of 'Knowledge'.", ["Information and understanding", "Hunger", "Noise", "Sleep"], "Information and understanding", "'Knowledge' means information and understanding."),
        ],
        "hard": [
            _mcq(1, "Choose the correct meaning of 'Loquacious'.", ["Talkative", "Silent", "Rude", "Quick"], "Talkative", "'Loquacious' means very talkative."),
            _mcq(2, "Choose the correct meaning of 'Obfuscate'.", ["To confuse", "To explain", "To improve", "To support"], "To confuse", "'Obfuscate' means to make unclear."),
            _mcq(3, "Choose the correct meaning of 'Ephemeral'.", ["Temporary", "Permanent", "Powerful", "Bright"], "Temporary", "'Ephemeral' means lasting for a short time."),
            _mcq(4, "Choose the correct meaning of 'Ubiquitous'.", ["Present everywhere", "Rare", "Hidden", "Distant"], "Present everywhere", "'Ubiquitous' means found everywhere."),
            _mcq(5, "Choose the correct meaning of 'Pernicious'.", ["Harmful", "Helpful", "Gentle", "Plain"], "Harmful", "'Pernicious' means very harmful."),
            _mcq(6, "Choose the correct meaning of 'Magnanimous'.", ["Generous", "Greedy", "Angry", "Weak"], "Generous", "'Magnanimous' means generous and noble."),
            _mcq(7, "Choose the correct meaning of 'Fastidious'.", ["Very careful", "Careless", "Noisy", "Friendly"], "Very careful", "'Fastidious' means very careful about details."),
            _mcq(8, "Choose the correct meaning of 'Sycophant'.", ["Flatterer", "Leader", "Scientist", "Poet"], "Flatterer", "'Sycophant' means someone who flatters for advantage."),
            _mcq(9, "Choose the correct meaning of 'Acerbic'.", ["Sharp and bitter", "Sweet", "Polite", "Calm"], "Sharp and bitter", "'Acerbic' means sharp or bitter in tone."),
            _mcq(10, "Choose the correct meaning of 'Vindictive'.", ["Revengeful", "Forgiving", "Happy", "Wise"], "Revengeful", "'Vindictive' means seeking revenge."),
        ],
    }
    return question_bank[difficulty]


_TOPIC_BUILDERS = {
    "percentages": _build_percentages,
    "profit_loss": _build_profit_loss,
    "ratio_proportion": _build_ratio_proportion,
    "time_work": _build_time_work,
    "time_speed_distance": _build_time_speed_distance,
    "simple_compound_interest": _build_simple_compound_interest,
    "averages": _build_averages,
    "mixtures_alligations": _build_mixtures_alligations,
    "permutations_combinations": _build_permutations_combinations,
    "probability": _build_probability,
    "number_system": _build_number_system,
    "data_interpretation": _build_data_interpretation,
    "geometry_mensuration": _build_geometry_mensuration,
    "coding_decoding": _build_coding_decoding,
    "blood_relations": _build_blood_relations,
    "syllogism": _build_syllogism,
    "direction_sense": _build_direction_sense,
    "seating_arrangement": _build_seating_arrangement,
    "puzzles": _build_puzzles,
    "pattern_recognition": _build_pattern_recognition,
    "series": _build_series,
    "reading_comprehension": _build_reading_comprehension,
    "error_detection": _build_error_detection,
    "sentence_correction": _build_sentence_correction,
    "synonyms_antonyms": _build_synonyms_antonyms,
    "para_jumbles": _build_para_jumbles,
    "vocabulary": _build_vocabulary,
}


def build_tcs_level_questions(topic, difficulty):
    builder = _TOPIC_BUILDERS.get(topic)
    if builder is None or difficulty not in LEVELS:
        return None
    questions = builder(difficulty)
    for index, question in enumerate(questions, start=1):
        question["difficulty"] = difficulty.title()
        question["id"] = index
    return questions
