import jKstra from 'jkstra'
const graph = new jKstra.Graph()

const areas = {
  0: [
    673,
    2089,
    595,
    2046,
    499,
    2046,
    429,
    2089,
    377,
    2055,
    334,
    1985,
    316,
    1915,
    194,
    1889,
    246,
    1767,
    429,
    1672,
    438,
    1506,
    490,
    1358,
    560,
    1271,
    595,
    1106,
    734,
    1132,
    856,
    1141,
    952,
    1106,
    996,
    984,
    1083,
    984,
    1126,
    975,
    1196,
    1019,
    1213,
    679,
    1283,
    592,
    1344,
    662,
    1370,
    897,
    1553,
    941,
    1597,
    1071,
    1632,
    1132,
    1710,
    1176,
    1884,
    1210,
    1893,
    1158,
    2006,
    1167,
    1980,
    1289,
    1997,
    1428,
    1989,
    1532,
    2058,
    1619,
    2206,
    1706,
    2128,
    1741,
    2041,
    1776,
    1980,
    1828,
    1928,
    1907,
    1745,
    1759,
    1597,
    1854,
    1362,
    1950,
    1240,
    1976,
    1118,
    2046,
    943,
    2150,
    813,
    2142,
    839,
    2081,
  ],
  1: [
    1501,
    1889,
    1361,
    1958,
    1335,
    2115,
    1283,
    2298,
    1353,
    2481,
    1675,
    2533,
    1910,
    2507,
    1788,
    2402,
    1666,
    2315,
    1623,
    2132,
    1579,
    1888,
  ],
  2: [
    1562,
    1849,
    1719,
    1762,
    1963,
    1971,
    2206,
    2084,
    2511,
    2145,
    2598,
    2241,
    2285,
    2510,
    1884,
    2467,
    1780,
    2389,
    1666,
    2293,
  ],
  3: [
    1337,
    2455,
    1311,
    2637,
    1363,
    2768,
    1433,
    2838,
    1773,
    2899,
    2025,
    2899,
    2200,
    2846,
    2278,
    2690,
    2269,
    2516,
    2034,
    2472,
    1860,
    2507,
    1651,
    2524,
    1494,
    2498,
  ],
  4: [
    692,
    2680,
    579,
    2593,
    527,
    2445,
    718,
    2288,
    858,
    2227,
    1058,
    2132,
    1197,
    2001,
    1372,
    1966,
    1354,
    2132,
    1311,
    2201,
    1311,
    2367,
    1337,
    2454,
    1311,
    2645,
    1006,
    2680,
    831,
    2666,
  ],
  5: [
    919,
    2153,
    832,
    2066,
    693,
    2092,
    588,
    2040,
    309,
    1935,
    30,
    1944,
    22,
    2519,
    213,
    2519,
    335,
    2510,
    536,
    2449,
    675,
    2327,
    745,
    2240,
    823,
    2231,
  ],
  6: [
    1999,
    1813,
    2208,
    1726,
    2365,
    1769,
    2557,
    1857,
    2766,
    1909,
    3097,
    2031,
    3236,
    2118,
    3315,
    2205,
    3210,
    2275,
    3123,
    2353,
    2914,
    2423,
    2827,
    2327,
    2714,
    2275,
    2592,
    2223,
    2522,
    2144,
    2287,
    2101,
    1973,
    1979,
    1947,
    1926,
  ],
  7: [
    1677,
    1124,
    1703,
    950,
    1677,
    723,
    1581,
    567,
    1590,
    488,
    1328,
    401,
    1215,
    366,
    954,
    401,
    814,
    418,
    884,
    514,
    893,
    654,
    875,
    793,
    875,
    950,
    884,
    1151,
    989,
    976,
    1154,
    985,
    1206,
    854,
    1206,
    645,
    1302,
    549,
    1381,
    689,
    1381,
    819,
    1442,
    915,
    1555,
    924,
  ],
  8: [
    1729,
    915,
    1729,
    758,
    1694,
    662,
    1616,
    575,
    1616,
    514,
    1755,
    532,
    1886,
    584,
    2095,
    689,
    2322,
    723,
    2470,
    776,
    2670,
    845,
    2670,
    994,
    2600,
    1090,
    2443,
    1055,
    2322,
    1072,
    2182,
    1107,
    1930,
    1037,
  ],
  9: [1233, 331, 1233, 148, 1546, 166, 1860, 200, 1956, 235, 1964, 331, 1834, 427, 1720, 488, 1538, 453],
  10: [1981, 3294, 1868, 3224, 1798, 3120, 1789, 2911, 1981, 2893, 2199, 2841, 2233, 3024, 2312, 3189, 2103, 3198],
  11: [
    2774,
    1874,
    2635,
    1839,
    2426,
    1760,
    2191,
    1664,
    2008,
    1534,
    2017,
    1316,
    2034,
    1168,
    1973,
    1133,
    1895,
    1142,
    1860,
    1185,
    1703,
    1115,
    1712,
    1011,
    1790,
    993,
    1912,
    1054,
    2147,
    1124,
    2531,
    1124,
    2705,
    1229,
    2853,
    1290,
    2766,
    1386,
    2626,
    1429,
    2592,
    1499,
    2600,
    1569,
    2679,
    1638,
    2809,
    1725,
    2879,
    1760,
  ],
  12: [
    2896,
    1325,
    2792,
    1421,
    2661,
    1456,
    2609,
    1525,
    2644,
    1586,
    2731,
    1665,
    2914,
    1769,
    3027,
    1752,
    3166,
    1752,
    3315,
    1734,
    3498,
    1665,
    3715,
    1578,
    3855,
    1578,
  ],
  13: [
    3837,
    1604,
    3698,
    1630,
    3585,
    1656,
    3393,
    1743,
    3184,
    1795,
    2931,
    1804,
    2853,
    1909,
    3010,
    1961,
    3175,
    2040,
    3341,
    2179,
    3541,
    2240,
    3776,
    2318,
    4020,
    2284,
    4221,
    2257,
    4403,
    2144,
    4125,
    2031,
    4133,
    1952,
    3985,
    1691,
  ],
  14: [
    2277,
    2498,
    2416,
    2367,
    2573,
    2228,
    2895,
    2393,
    2861,
    2515,
    2765,
    2637,
    2747,
    2768,
    2713,
    2959,
    2834,
    3220,
    2591,
    3238,
    2347,
    3177,
    2233,
    3029,
    2207,
    2846,
    2294,
    2663,
  ],
  15: [
    1206,
    314,
    1206,
    183,
    1206,
    122,
    954,
    113,
    605,
    96,
    492,
    26,
    362,
    61,
    266,
    131,
    13,
    174,
    161,
    209,
    283,
    288,
    466,
    331,
    736,
    366,
    858,
    401,
    1076,
    366,
  ],
  16: [
    4464,
    2179,
    4308,
    2275,
    4029,
    2292,
    3811,
    2362,
    3794,
    2510,
    3881,
    2615,
    3942,
    2719,
    3994,
    2876,
    4099,
    2937,
    4186,
    3033,
    4255,
    3155,
    4403,
    3216,
    4639,
    3190,
    4665,
    3103,
    4630,
    3007,
    4552,
    2929,
    4578,
    2850,
    4569,
    2728,
    4499,
    2597,
    4630,
    2493,
    4795,
    2449,
    4917,
    2414,
    4717,
    2310,
    4569,
    2266,
  ],
  17: [
    2931,
    2432,
    2896,
    2545,
    2801,
    2632,
    2783,
    2763,
    2766,
    2885,
    2748,
    3007,
    2809,
    3138,
    2827,
    3207,
    2870,
    3286,
    2931,
    3321,
    2966,
    3356,
    3106,
    3356,
    3297,
    3373,
    3428,
    3321,
    3454,
    3225,
    3602,
    3181,
    3750,
    3181,
    3776,
    3234,
    3863,
    3164,
    3950,
    3085,
    4064,
    3068,
    4125,
    3042,
    3994,
    2937,
    3916,
    2833,
    3890,
    2728,
    3829,
    2658,
    3768,
    2571,
    3724,
    2519,
    3741,
    2458,
    3741,
    2362,
    3680,
    2301,
    3593,
    2275,
    3480,
    2266,
    3376,
    2240,
    3306,
    2240,
    3193,
    2318,
    3140,
    2371,
  ],
  18: [
    2294,
    3194,
    2582,
    3229,
    2817,
    3229,
    2939,
    3377,
    3192,
    3386,
    3174,
    3507,
    3296,
    3655,
    3444,
    3760,
    3139,
    3803,
    2991,
    3830,
    2660,
    3925,
    2477,
    3777,
    2416,
    3655,
    1990,
    3507,
    1972,
    3403,
    2016,
    3281,
    2129,
    3194,
  ],
  19: [
    1450,
    2855,
    1773,
    2907,
    1781,
    3099,
    1869,
    3203,
    1999,
    3325,
    1999,
    3490,
    1686,
    3604,
    1529,
    3534,
    1389,
    3569,
    1206,
    3464,
    1111,
    3473,
    1067,
    3429,
    1093,
    3273,
    1128,
    3186,
    1137,
    3081,
  ],
  20: [
    701,
    2698,
    623,
    2846,
    605,
    3003,
    440,
    3273,
    457,
    3360,
    553,
    3395,
    666,
    3386,
    719,
    3412,
    832,
    3456,
    928,
    3377,
    997,
    3412,
    1050,
    3421,
    1137,
    3064,
    1433,
    2846,
    1285,
    2655,
    1024,
    2690,
  ],
  21: [
    501,
    2484,
    422,
    2519,
    266,
    2554,
    39,
    2554,
    4,
    2615,
    -4,
    2772,
    -4,
    2894,
    13,
    3103,
    22,
    3434,
    179,
    3391,
    309,
    3443,
    449,
    3391,
    414,
    3277,
    492,
    3181,
    571,
    3077,
    614,
    2885,
    684,
    2711,
    571,
    2685,
  ],
  22: [
    727,
    4245,
    693,
    4123,
    666,
    4036,
    614,
    3975,
    675,
    3896,
    675,
    3818,
    649,
    3730,
    597,
    3643,
    527,
    3608,
    414,
    3652,
    318,
    3626,
    301,
    3486,
    414,
    3443,
    518,
    3391,
    632,
    3417,
    754,
    3460,
    849,
    3486,
    919,
    3399,
    989,
    3417,
    1032,
    3478,
    1111,
    3504,
    1198,
    3486,
    1294,
    3521,
    1346,
    3565,
    1346,
    3626,
    1276,
    3687,
    1320,
    3765,
    1267,
    3826,
    1189,
    3861,
    1119,
    3879,
    1067,
    3948,
    1050,
    4001,
    989,
    4036,
    936,
    4062,
    963,
    4105,
    902,
    4131,
    884,
    4192,
    823,
    4201,
  ],
  23: [
    1416,
    3600,
    1389,
    3661,
    1337,
    3713,
    1372,
    3783,
    1328,
    3844,
    1233,
    3879,
    1259,
    3931,
    1154,
    3922,
    1128,
    3983,
    1085,
    4044,
    1015,
    4062,
    1032,
    4114,
    963,
    4149,
    928,
    4184,
    875,
    4227,
    823,
    4245,
    745,
    4288,
    649,
    4349,
    544,
    4454,
    588,
    4532,
    649,
    4585,
    719,
    4602,
    780,
    4698,
    884,
    4698,
    971,
    4768,
    1067,
    4637,
    1241,
    4628,
    1372,
    4585,
    1529,
    4480,
    1642,
    4314,
    1668,
    4166,
    1659,
    4009,
    1659,
    3852,
    1686,
    3722,
    1625,
    3617,
    1520,
    3556,
  ],
  24: [
    248,
    4489,
    353,
    4506,
    475,
    4428,
    544,
    4358,
    649,
    4288,
    640,
    4175,
    614,
    4053,
    553,
    3931,
    605,
    3826,
    562,
    3696,
    501,
    3669,
    396,
    3704,
    309,
    3687,
    248,
    3574,
    240,
    3469,
    152,
    3425,
    -4,
    3460,
    4,
    4149,
    109,
    4332,
    100,
    4402,
    170,
    4480,
  ],
  25: [
    4,
    5195,
    283,
    5177,
    431,
    5169,
    562,
    5238,
    701,
    5186,
    640,
    5134,
    605,
    5055,
    666,
    4968,
    614,
    4951,
    675,
    4872,
    719,
    4759,
    684,
    4646,
    579,
    4611,
    492,
    4524,
    388,
    4532,
    257,
    4550,
    152,
    4550,
    118,
    4454,
    57,
    4419,
    74,
    4341,
    13,
    4227,
  ],
  26: [
    431,
    6267,
    318,
    6302,
    231,
    6328,
    144,
    6389,
    13,
    6371,
    4,
    5212,
    179,
    5212,
    309,
    5221,
    466,
    5221,
    414,
    5352,
    449,
    5526,
    388,
    5735,
    431,
    5866,
    449,
    5970,
    475,
    6066,
    449,
    6136,
  ],
  27: [
    483,
    6249,
    623,
    6154,
    780,
    6127,
    823,
    5892,
    797,
    5726,
    788,
    5587,
    719,
    5230,
    632,
    5264,
    492,
    5256,
    483,
    5421,
    449,
    5674,
    414,
    5753,
    466,
    5848,
    492,
    5979,
    501,
    6075,
  ],
  28: [
    2956,
    3833,
    2660,
    3928,
    2634,
    4042,
    2730,
    4137,
    2869,
    4268,
    3061,
    4338,
    3183,
    4503,
    3253,
    4642,
    3427,
    4607,
    3627,
    4486,
    3906,
    4364,
    4089,
    4311,
    4071,
    4163,
    3950,
    3937,
    3740,
    3885,
    3566,
    3850,
    3462,
    3772,
    3296,
    3798,
  ],
  29: [
    2686,
    4119,
    2494,
    4250,
    2198,
    4250,
    2206,
    4668,
    2555,
    4807,
    2842,
    4876,
    2982,
    4990,
    2999,
    4789,
    3261,
    4641,
    3130,
    4406,
    2860,
    4267,
  ],
  30: [
    2235,
    4704,
    2462,
    4791,
    2627,
    4852,
    2967,
    4965,
    3089,
    5140,
    3028,
    5262,
    2897,
    5375,
    2767,
    5462,
    2645,
    5488,
    2383,
    5558,
    2166,
    5671,
    2035,
    5706,
    1974,
    5541,
    1931,
    5384,
    1826,
    5305,
    1660,
    5218,
    1591,
    5183,
    1826,
    5096,
    1948,
    5000,
    2086,
    4890,
  ],
  31: [
    1372,
    5892,
    1180,
    5970,
    1024,
    6014,
    875,
    6014,
    875,
    5848,
    841,
    5718,
    858,
    5604,
    858,
    5500,
    806,
    5378,
    771,
    5195,
    693,
    5125,
    710,
    4968,
    754,
    4846,
    806,
    4724,
    910,
    4794,
    963,
    4855,
    997,
    4907,
    971,
    4977,
    1041,
    5151,
    1215,
    5325,
    1241,
    5421,
    1285,
    5570,
    1337,
    5657,
    1372,
    5805,
  ],
  32: [
    4743,
    3173,
    4822,
    3173,
    4987,
    3199,
    5187,
    3269,
    5344,
    3173,
    5449,
    3085,
    5458,
    3024,
    5292,
    2920,
    5240,
    2833,
    5275,
    2667,
    5370,
    2624,
    5344,
    2545,
    5222,
    2536,
    5127,
    2493,
    4935,
    2432,
    4778,
    2501,
    4682,
    2519,
    4569,
    2580,
    4621,
    2772,
    4621,
    2868,
    4639,
    2911,
    4691,
    3007,
  ],
  33: [
    1956,
    5726,
    1825,
    5796,
    1651,
    5831,
    1450,
    5875,
    1381,
    5700,
    1381,
    5639,
    1311,
    5543,
    1294,
    5369,
    1459,
    5273,
    1555,
    5203,
    1712,
    5256,
    1781,
    5317,
    1869,
    5413,
    1930,
    5535,
    1973,
    5613,
  ],
  34: [
    1938,
    4933,
    2051,
    4855,
    2156,
    4689,
    2199,
    4637,
    2156,
    4489,
    2156,
    4332,
    2086,
    4271,
    1964,
    4236,
    1842,
    4166,
    1703,
    4088,
    1694,
    4253,
    1685,
    4341,
    1598,
    4419,
    1581,
    4497,
    1529,
    4550,
    1450,
    4593,
    1459,
    4663,
    1659,
    4742,
    1790,
    4785,
    1860,
    4872,
  ],
  35: [
    1250,
    5325,
    1389,
    5282,
    1538,
    5160,
    1668,
    5108,
    1799,
    5047,
    1903,
    4968,
    1773,
    4864,
    1659,
    4785,
    1511,
    4742,
    1416,
    4637,
    1302,
    4654,
    1206,
    4681,
    1093,
    4698,
    1024,
    4785,
    1041,
    4898,
    1024,
    4959,
    1024,
    5020,
    1102,
    5169,
  ],
  36: [
    3950,
    3913,
    3872,
    3931,
    3794,
    3905,
    3715,
    3870,
    3619,
    3826,
    3515,
    3757,
    3445,
    3713,
    3367,
    3678,
    3323,
    3617,
    3219,
    3513,
    3219,
    3434,
    3315,
    3417,
    3463,
    3391,
    3489,
    3312,
    3524,
    3251,
    3637,
    3234,
    3707,
    3251,
    3785,
    3251,
    3863,
    3242,
    3916,
    3199,
    3985,
    3138,
    4038,
    3129,
    4133,
    3094,
    4177,
    3155,
    4247,
    3199,
    4308,
    3234,
    4351,
    3269,
    4316,
    3347,
    4247,
    3399,
    4168,
    3452,
    4151,
    3565,
    4133,
    3669,
    4029,
    3687,
    4011,
    3765,
    3994,
    3826,
    3994,
    3879,
  ],
  37: [
    2896,
    6467,
    1468,
    6467,
    1764,
    6232,
    2069,
    6136,
    2147,
    6031,
    2269,
    5831,
    2470,
    5674,
    2644,
    5622,
    2809,
    5665,
    2984,
    5709,
    3149,
    5726,
    3297,
    5726,
    3158,
    5866,
  ],
  38: [
    4943,
    4030,
    4855,
    3908,
    4603,
    3908,
    4542,
    3830,
    4498,
    3934,
    4350,
    3978,
    4324,
    4108,
    4507,
    4204,
    4307,
    4273,
    4132,
    4300,
    3950,
    3917,
    4019,
    3847,
    4054,
    3716,
    4141,
    3629,
    4167,
    3490,
    4315,
    3386,
    4368,
    3238,
    4551,
    3220,
    4690,
    3194,
    4768,
    3177,
    4977,
    3246,
    5134,
    3307,
    5369,
    3629,
    5282,
    3803,
  ],
  39: [
    5161,
    4864,
    5214,
    4916,
    5344,
    4925,
    5440,
    5003,
    5562,
    4959,
    5675,
    4881,
    5850,
    4733,
    5919,
    4628,
    6024,
    4489,
    6146,
    4515,
    6102,
    4393,
    6181,
    4253,
    6198,
    4123,
    6163,
    4036,
    5989,
    3975,
    5832,
    3896,
    5423,
    3844,
    5196,
    4053,
    4839,
    4262,
    4700,
    4297,
    4438,
    4358,
    4543,
    4428,
    4726,
    4454,
    4883,
    4541,
    4996,
    4593,
    5118,
    4715,
  ],
  40: [
    3489,
    4742,
    3846,
    4576,
    4038,
    4471,
    4395,
    4393,
    4682,
    4497,
    4804,
    4541,
    4978,
    4628,
    5066,
    4733,
    5127,
    4837,
    5039,
    4794,
    4961,
    4785,
    4891,
    4759,
    4769,
    4794,
    4708,
    4864,
    4656,
    4916,
    4586,
    4890,
    4525,
    4890,
    4421,
    4890,
    4342,
    4820,
    4221,
    4811,
    4160,
    4846,
    4090,
    4881,
    4020,
    4898,
    3942,
    4855,
    3611,
    4776,
  ],
  41: [
    3349,
    5683,
    3506,
    5552,
    3628,
    5360,
    3785,
    5186,
    3881,
    5142,
    4003,
    4968,
    3829,
    4864,
    3663,
    4846,
    3454,
    4768,
    3306,
    4776,
    3193,
    4855,
    3245,
    4977,
    3376,
    5047,
    3437,
    5116,
    3419,
    5264,
    3332,
    5308,
    3201,
    5378,
    3123,
    5456,
    2940,
    5570,
    2870,
    5631,
    3001,
    5674,
    3140,
    5692,
    3227,
    5683,
  ],
  42: [
    6146,
    3975,
    6233,
    3852,
    6346,
    3730,
    6494,
    3652,
    6398,
    3565,
    6268,
    3513,
    6128,
    3513,
    6059,
    3521,
    5963,
    3521,
    5893,
    3469,
    5762,
    3417,
    5658,
    3425,
    5492,
    3469,
    5562,
    3608,
    5553,
    3669,
    5527,
    3739,
    5501,
    3818,
    5736,
    3826,
    5858,
    3852,
    5998,
    3940,
  ],
  43: [
    6215,
    4550,
    6181,
    4375,
    6250,
    4236,
    6250,
    4131,
    6224,
    3992,
    6268,
    3905,
    6346,
    3835,
    6424,
    3783,
    6512,
    3687,
    6581,
    3730,
    6668,
    3748,
    6755,
    3791,
    6886,
    3835,
    6860,
    3957,
    6843,
    4036,
    6825,
    4131,
    6782,
    4210,
    6755,
    4262,
    6712,
    4349,
    6695,
    4402,
    6755,
    4445,
    6790,
    4489,
    6843,
    4550,
    6886,
    4593,
    6991,
    4654,
    7034,
    4724,
    6991,
    4776,
    6921,
    4829,
    6825,
    4837,
    6712,
    4820,
  ],
  44: [
    6650,
    3696,
    6720,
    3600,
    6729,
    3486,
    6650,
    3408,
    6589,
    3295,
    6389,
    3242,
    6206,
    3216,
    6145,
    3129,
    6032,
    3042,
    5840,
    2990,
    5771,
    3024,
    5771,
    3129,
    5710,
    3173,
    5588,
    3216,
    5501,
    3260,
    5361,
    3312,
    5405,
    3373,
    5440,
    3434,
    5622,
    3391,
    5762,
    3391,
    5997,
    3478,
    6163,
    3460,
    6294,
    3478,
  ],
  45: [
    6721,
    3722,
    6799,
    3591,
    6834,
    3495,
    6773,
    3408,
    6712,
    3408,
    6668,
    3277,
    6816,
    3216,
    6930,
    3138,
    7008,
    3077,
    7087,
    3033,
    7156,
    3033,
    7261,
    3059,
    7418,
    3120,
    7479,
    3146,
    7479,
    3242,
    7435,
    3364,
    7409,
    3460,
    7357,
    3530,
    7261,
    3574,
    7147,
    3635,
    7052,
    3704,
    6965,
    3748,
    6825,
    3783,
  ],
  46: [
    5728,
    2990,
    5815,
    2955,
    5928,
    2972,
    6076,
    2998,
    6189,
    3042,
    6233,
    3120,
    6259,
    3190,
    6363,
    3190,
    6468,
    3216,
    6546,
    3225,
    6607,
    3234,
    6686,
    3216,
    6782,
    3173,
    6869,
    3120,
    6912,
    3059,
    6982,
    3007,
    6956,
    2911,
    6860,
    2850,
    6721,
    2754,
    6634,
    2702,
    6485,
    2528,
    6259,
    2545,
    6128,
    2563,
    5850,
    2615,
    5597,
    2676,
    5492,
    2763,
    5519,
    2833,
    5606,
    2937,
  ],
  47: [
    5640,
    2423,
    5675,
    2345,
    5640,
    2249,
    5710,
    2135,
    5701,
    2057,
    5597,
    2005,
    5632,
    1944,
    5632,
    1857,
    5701,
    1804,
    5762,
    1830,
    5850,
    1883,
    5945,
    1874,
    6006,
    1848,
    6093,
    1787,
    6172,
    1778,
    6242,
    1839,
    6337,
    1804,
    6416,
    1734,
    6503,
    1752,
    6546,
    1822,
    6538,
    1900,
    6503,
    1952,
    6494,
    2022,
    6468,
    2127,
    6512,
    2196,
    6573,
    2231,
    6529,
    2353,
    6424,
    2362,
    6311,
    2388,
    6154,
    2423,
    5841,
    2458,
    5745,
    2458,
  ],
  48: [
    5588,
    2423,
    5614,
    2318,
    5588,
    2257,
    5632,
    2144,
    5632,
    2074,
    5501,
    2013,
    5553,
    1952,
    5545,
    1857,
    5614,
    1761,
    5597,
    1656,
    5536,
    1656,
    5484,
    1630,
    5440,
    1543,
    5301,
    1508,
    5231,
    1403,
    5144,
    1342,
    5083,
    1360,
    5066,
    1412,
    4987,
    1447,
    4874,
    1438,
    4813,
    1447,
    4761,
    1482,
    4743,
    1560,
    4700,
    1621,
    4717,
    1691,
    4717,
    1752,
    4630,
    1787,
    4508,
    1822,
    4464,
    1865,
    4403,
    1987,
    4665,
    2109,
    5092,
    2257,
    5449,
    2423,
  ],
  49: [
    4386,
    1987,
    4395,
    1839,
    4508,
    1769,
    4647,
    1752,
    4613,
    1612,
    4674,
    1525,
    4752,
    1412,
    4726,
    1325,
    4656,
    1316,
    4586,
    1255,
    4456,
    1203,
    4421,
    1089,
    4351,
    1028,
    4308,
    1072,
    4160,
    993,
    4099,
    1019,
    4029,
    950,
    3977,
    828,
    4011,
    741,
    3410,
    741,
    3097,
    1185,
    3376,
    1325,
    3672,
    1429,
    3898,
    1543,
    4020,
    1595,
    4194,
    1761,
    4264,
    1891,
  ],
  50: [
    4812,
    1402,
    4977,
    1411,
    5099,
    1324,
    5134,
    1202,
    5134,
    1097,
    5065,
    1019,
    5021,
    914,
    4873,
    879,
    4768,
    853,
    4760,
    766,
    4063,
    766,
    4028,
    844,
    4106,
    975,
    4220,
    975,
    4385,
    975,
    4472,
    1089,
    4498,
    1184,
    4665,
    1264,
    4778,
    1307,
  ],
  51: [
    5536,
    1569,
    5675,
    1551,
    5719,
    1456,
    5771,
    1386,
    5928,
    1386,
    5954,
    1281,
    6006,
    1212,
    6024,
    1133,
    5998,
    1081,
    5954,
    1037,
    5867,
    985,
    5789,
    915,
    5736,
    941,
    5667,
    941,
    5614,
    1055,
    5562,
    1072,
    5510,
    1081,
    5423,
    1133,
    5379,
    1177,
    5327,
    1133,
    5248,
    1098,
    5196,
    1116,
    5170,
    1185,
    5170,
    1281,
    5222,
    1360,
    5301,
    1438,
    5388,
    1447,
  ],
  52: [
    5179,
    1046,
    5283,
    1063,
    5370,
    1116,
    5431,
    1072,
    5597,
    1037,
    5597,
    941,
    5701,
    898,
    5658,
    845,
    5640,
    767,
    5588,
    732,
    5492,
    723,
    5440,
    697,
    5388,
    619,
    5327,
    532,
    5353,
    427,
    4778,
    410,
    4795,
    741,
    4813,
    811,
    4874,
    854,
    4987,
    845,
    5100,
    924,
    5118,
    1002,
  ],
  53: [
    5693,
    1761,
    5797,
    1769,
    5884,
    1865,
    5954,
    1804,
    6093,
    1752,
    6189,
    1743,
    6268,
    1795,
    6311,
    1752,
    6390,
    1665,
    6337,
    1551,
    6355,
    1473,
    6303,
    1395,
    6337,
    1342,
    6311,
    1290,
    6294,
    1238,
    6250,
    1212,
    6233,
    1142,
    6128,
    1151,
    6041,
    1246,
    5998,
    1368,
    5937,
    1421,
    5806,
    1447,
    5719,
    1551,
    5606,
    1595,
    5562,
    1612,
    5675,
    1639,
    5667,
    1700,
  ],
  54: [
    6442,
    1665,
    6555,
    1726,
    6590,
    1778,
    6695,
    1778,
    6790,
    1804,
    6834,
    1743,
    6904,
    1700,
    6973,
    1656,
    6947,
    1578,
    6982,
    1508,
    6947,
    1447,
    6973,
    1351,
    6904,
    1325,
    6834,
    1246,
    6738,
    1229,
    6668,
    1133,
    6668,
    1011,
    6573,
    1011,
    6503,
    941,
    6372,
    941,
    6320,
    1002,
    6250,
    1046,
    6250,
    1107,
    6320,
    1177,
  ],
  55: [
    6067,
    1089,
    6172,
    1081,
    6259,
    1011,
    6363,
    915,
    6459,
    880,
    6590,
    941,
    6703,
    976,
    6729,
    836,
    6747,
    749,
    6773,
    636,
    6869,
    540,
    6965,
    488,
    7008,
    409,
    5405,
    409,
    5405,
    514,
    5466,
    653,
    5667,
    706,
    5728,
    836,
    5963,
    976,
  ],
  56: [
    6564,
    2345,
    6668,
    2397,
    7147,
    2336,
    7357,
    2397,
    7426,
    2292,
    7496,
    2196,
    7409,
    2092,
    7400,
    1979,
    7426,
    1865,
    7505,
    1743,
    7383,
    1734,
    7339,
    1761,
    7278,
    1761,
    7165,
    1647,
    7078,
    1682,
    6999,
    1665,
    6869,
    1778,
    6825,
    1839,
    6755,
    1857,
    6660,
    1830,
    6590,
    1883,
    6555,
    1944,
    6555,
    2048,
    6564,
    2162,
    6642,
    2144,
    6651,
    2223,
  ],
  57: [
    7165,
    1612,
    7278,
    1717,
    7444,
    1717,
    7548,
    1708,
    7661,
    1656,
    7775,
    1726,
    7879,
    1639,
    7958,
    1604,
    7975,
    1534,
    8071,
    1464,
    8071,
    1377,
    7914,
    1316,
    7914,
    1229,
    7992,
    1116,
    7940,
    1055,
    7940,
    976,
    7853,
    915,
    7844,
    811,
    7862,
    723,
    7827,
    645,
    7775,
    654,
    7722,
    567,
    7688,
    488,
    7627,
    418,
    7087,
    401,
    7034,
    453,
    6999,
    506,
    6973,
    558,
    6921,
    567,
    6886,
    619,
    6843,
    654,
    6790,
    732,
    6834,
    767,
    6782,
    819,
    6764,
    924,
    6729,
    1002,
    6729,
    1124,
    6790,
    1194,
    6921,
    1281,
    6999,
    1334,
    6991,
    1473,
    7026,
    1525,
    6991,
    1612,
    7069,
    1621,
  ],
  58: [
    8672,
    1987,
    8689,
    1787,
    8628,
    1743,
    8594,
    1682,
    8454,
    1639,
    8289,
    1560,
    8210,
    1569,
    8123,
    1639,
    8019,
    1612,
    8106,
    1482,
    8132,
    1412,
    8219,
    1368,
    8245,
    1273,
    8306,
    1238,
    8393,
    1185,
    8533,
    1229,
    8594,
    1142,
    8698,
    1142,
    8785,
    1081,
    8855,
    1098,
    8916,
    1142,
    8959,
    1220,
    8942,
    1290,
    8942,
    1351,
    8942,
    1412,
    8977,
    1482,
    9029,
    1508,
    9020,
    1586,
    9003,
    1691,
    8925,
    1743,
    8907,
    1865,
    8820,
    1865,
    8742,
    1918,
    8724,
    1970,
  ],
  59: [
    8176,
    1343,
    8228,
    1264,
    8315,
    1203,
    8385,
    1160,
    8472,
    1160,
    8542,
    1186,
    8585,
    1125,
    8594,
    1055,
    8568,
    1011,
    8611,
    889,
    8611,
    820,
    8550,
    732,
    8463,
    654,
    8463,
    506,
    8411,
    419,
    8176,
    419,
    8123,
    480,
    8071,
    506,
    7984,
    410,
    7705,
    401,
    7792,
    584,
    7862,
    619,
    7923,
    820,
    7914,
    889,
    8010,
    915,
    8027,
    1037,
    8045,
    1116,
    8019,
    1203,
    8001,
    1255,
    8027,
    1307,
    8106,
    1360,
  ],
  60: [
    9326,
    1090,
    9326,
    410,
    8995,
    410,
    8916,
    497,
    8812,
    410,
    8751,
    419,
    8577,
    419,
    8516,
    506,
    8507,
    584,
    8524,
    663,
    8620,
    802,
    8629,
    924,
    8611,
    1011,
    8620,
    1099,
    8681,
    1125,
    8777,
    1055,
    8873,
    1090,
    8925,
    1133,
    8960,
    1177,
    9021,
    1177,
    9064,
    1090,
    9160,
    1037,
  ],
  61: [
    9317,
    1952,
    9212,
    1996,
    9134,
    1987,
    9003,
    1935,
    8898,
    1918,
    8829,
    1918,
    8785,
    2013,
    8733,
    2048,
    8637,
    2005,
    8620,
    2109,
    8559,
    2240,
    8585,
    2414,
    8567,
    2493,
    8620,
    2563,
    8602,
    2676,
    8672,
    2763,
    8759,
    2798,
    8698,
    2868,
    8663,
    2955,
    8628,
    3051,
    8698,
    3059,
    8794,
    2963,
    8942,
    2981,
    9038,
    2911,
    9116,
    2894,
    9186,
    2833,
    9238,
    2772,
    9273,
    2728,
    9343,
    2763,
    9343,
    2092,
  ],
  62: [
    8968,
    1874,
    8986,
    1778,
    9047,
    1734,
    9081,
    1665,
    9081,
    1525,
    9081,
    1464,
    9012,
    1447,
    9020,
    1360,
    9047,
    1307,
    9003,
    1281,
    9029,
    1203,
    9081,
    1203,
    9090,
    1133,
    9142,
    1107,
    9195,
    1090,
    9299,
    1142,
    9334,
    1883,
    9290,
    1935,
    9238,
    1961,
    9151,
    1935,
    9055,
    1909,
  ],
  63: [
    8499,
    2441,
    8490,
    2345,
    8481,
    2275,
    8507,
    2171,
    8542,
    2040,
    8568,
    1988,
    8594,
    1883,
    8603,
    1813,
    8542,
    1779,
    8446,
    1691,
    8394,
    1709,
    8316,
    1674,
    8263,
    1630,
    8194,
    1630,
    8150,
    1700,
    8063,
    1718,
    7985,
    1700,
    7906,
    1657,
    7854,
    1700,
    7810,
    1735,
    7732,
    1779,
    7680,
    1770,
    7636,
    1726,
    7575,
    1735,
    7523,
    1770,
    7488,
    1813,
    7436,
    1901,
    7410,
    1962,
    7427,
    2058,
    7453,
    2119,
    7514,
    2145,
    7523,
    2197,
    7462,
    2310,
    7375,
    2380,
    7575,
    2362,
    7741,
    2310,
    7871,
    2257,
    7967,
    2196,
    8046,
    2179,
    8124,
    2127,
    8072,
    2257,
    7950,
    2301,
    7906,
    2353,
    7845,
    2397,
    7941,
    2440,
    8054,
    2440,
    8176,
    2449,
    8272,
    2449,
    8411,
    2423,
  ],
  64: [
    7539,
    3103,
    7688,
    3094,
    7792,
    3094,
    7975,
    2981,
    8088,
    3016,
    8236,
    3051,
    8402,
    3007,
    8480,
    2955,
    8585,
    3007,
    8655,
    2902,
    8689,
    2798,
    8567,
    2754,
    8567,
    2650,
    8576,
    2580,
    8524,
    2519,
    8524,
    2467,
    8428,
    2458,
    8350,
    2475,
    8219,
    2484,
    8123,
    2484,
    7949,
    2467,
    7853,
    2449,
    7235,
    2467,
    6555,
    2510,
    6642,
    2658,
    6738,
    2728,
    6904,
    2833,
    7008,
    2885,
    7052,
    3007,
    7147,
    2972,
    7339,
    3042,
  ],
  65: [
    7513,
    3382,
    7574,
    3417,
    7609,
    3478,
    7661,
    3530,
    7749,
    3539,
    7792,
    3608,
    7853,
    3643,
    7914,
    3661,
    7984,
    3722,
    8036,
    3757,
    8202,
    3704,
    8193,
    3626,
    8254,
    3530,
    8271,
    3469,
    8228,
    3364,
    8202,
    3295,
    8219,
    3225,
    8219,
    3164,
    8175,
    3103,
    8071,
    3051,
    7975,
    3051,
    7888,
    3051,
    7783,
    3120,
    7705,
    3112,
    7539,
    3146,
    7505,
    3277,
  ],
  66: [
    8027,
    3774,
    8202,
    3730,
    8297,
    3809,
    8384,
    3835,
    8463,
    3861,
    8524,
    3922,
    8585,
    3957,
    8681,
    4105,
    8742,
    4201,
    8803,
    4245,
    8759,
    4306,
    8829,
    4454,
    8820,
    4524,
    8768,
    4567,
    8672,
    4558,
    8559,
    4506,
    8411,
    4314,
    8315,
    4288,
    8245,
    4349,
    8193,
    4410,
    8123,
    4332,
    8167,
    4271,
    8167,
    4114,
    8106,
    4027,
    8097,
    3931,
    8123,
    3852,
  ],
  67: [
    8585,
    4803,
    8672,
    4750,
    8742,
    4689,
    8742,
    4602,
    8541,
    4541,
    8454,
    4463,
    8445,
    4384,
    8376,
    4349,
    8315,
    4332,
    8263,
    4410,
    8236,
    4463,
    8097,
    4602,
    8149,
    4672,
    8236,
    4724,
    8384,
    4715,
  ],
  68: [
    8315,
    5308,
    8428,
    5221,
    8515,
    5108,
    8559,
    5073,
    8576,
    4820,
    8411,
    4750,
    8315,
    4750,
    8202,
    4759,
    8097,
    4672,
    7992,
    4724,
    7871,
    4768,
    7792,
    4811,
    7740,
    4907,
    7810,
    4968,
    7975,
    4942,
    8062,
    5047,
    8106,
    5186,
  ],
  69: [
    8106,
    5526,
    8149,
    5482,
    8271,
    5439,
    8323,
    5352,
    8254,
    5343,
    8193,
    5264,
    8088,
    5221,
    8027,
    5055,
    7949,
    4977,
    7818,
    5029,
    7679,
    4959,
    7566,
    4968,
    7470,
    5012,
    7418,
    5108,
    7365,
    5177,
    7383,
    5230,
    7496,
    5343,
    7679,
    5378,
    7836,
    5360,
    7931,
    5386,
    8019,
    5430,
  ],
  70: [
    7818,
    5796,
    7897,
    5744,
    7949,
    5718,
    7958,
    5657,
    8036,
    5622,
    8036,
    5543,
    8036,
    5474,
    7966,
    5439,
    7871,
    5395,
    7766,
    5413,
    7714,
    5386,
    7618,
    5404,
    7513,
    5369,
    7470,
    5456,
    7461,
    5526,
    7470,
    5578,
    7435,
    5613,
    7374,
    5665,
    7461,
    5709,
    7618,
    5726,
    7714,
    5770,
  ],
  71: [
    7095,
    4724,
    7208,
    4690,
    7269,
    4576,
    7409,
    4506,
    7487,
    4445,
    7548,
    4384,
    7513,
    4245,
    7487,
    4088,
    7461,
    4001,
    7348,
    3966,
    7261,
    4027,
    7235,
    4097,
    7174,
    4132,
    7069,
    4175,
    7026,
    4219,
    6912,
    4236,
    6764,
    4315,
    6808,
    4428,
    6851,
    4472,
    6991,
    4593,
    7069,
    4672,
  ],
  72: [
    1703,
    4001,
    1712,
    3922,
    1712,
    3826,
    1738,
    3757,
    1738,
    3661,
    1720,
    3600,
    1808,
    3582,
    1921,
    3565,
    2008,
    3530,
    2147,
    3565,
    2348,
    3643,
    2409,
    3696,
    2487,
    3809,
    2574,
    3887,
    2626,
    3948,
    2644,
    4062,
    2687,
    4140,
    2592,
    4219,
    2452,
    4262,
    2322,
    4271,
    2200,
    4253,
    2069,
    4219,
    1930,
    4175,
    1834,
    4079,
    1720,
    4044,
  ],
  73: [],
  74: [],
  75: [],
  76: [],
  77: [],
  78: [],
  79: [],
  80: [
    8297,
    6215,
    8437,
    6206,
    8533,
    6302,
    8637,
    6355,
    8768,
    6381,
    8933,
    6363,
    9134,
    6320,
    9186,
    6233,
    9177,
    6145,
    9177,
    6032,
    9212,
    5945,
    9229,
    5788,
    9238,
    5631,
    9229,
    5500,
    9160,
    5422,
    9081,
    5326,
    8994,
    5361,
    8881,
    5317,
    8837,
    5282,
    8768,
    5230,
    8611,
    5230,
    8576,
    5317,
    8541,
    5413,
    8463,
    5431,
    8437,
    5500,
    8367,
    5518,
    8332,
    5692,
    8236,
    5735,
    8184,
    5779,
    8175,
    5927,
    8175,
    6040,
  ],
  81: [
    7583,
    6258,
    7670,
    6232,
    7722,
    6197,
    7783,
    6206,
    7879,
    6188,
    7940,
    6162,
    7975,
    6092,
    8027,
    6023,
    7818,
    5848,
    7696,
    5805,
    7548,
    5761,
    7418,
    5761,
    7357,
    5709,
    7287,
    5753,
    7252,
    5787,
    7200,
    5866,
    7287,
    5927,
    7444,
    6040,
  ],
  82: [
    6895,
    6371,
    6782,
    6371,
    6729,
    6301,
    6616,
    6284,
    6529,
    6171,
    6529,
    6118,
    6660,
    6127,
    6764,
    6083,
    6790,
    6005,
    6877,
    5996,
    6921,
    5979,
    6991,
    5909,
    7026,
    5857,
    7174,
    5900,
    7235,
    5953,
    7339,
    5996,
    7426,
    6049,
    7479,
    6127,
    7531,
    6197,
    7557,
    6249,
    7374,
    6345,
    7287,
    6363,
    7174,
    6371,
    6991,
    6380,
  ],
  83: [
    9273,
    3094,
    9221,
    3068,
    9195,
    3007,
    9134,
    3042,
    9081,
    3094,
    8977,
    3138,
    8907,
    3138,
    8837,
    3164,
    8803,
    3286,
    8803,
    3434,
    8742,
    3478,
    8759,
    3565,
    8846,
    3626,
    8959,
    3687,
    9029,
    3748,
    9090,
    3783,
    9203,
    3704,
    9290,
    3617,
  ],
  84: [
    6512,
    6040,
    6503,
    5883,
    6433,
    5840,
    6337,
    5753,
    6329,
    5639,
    6285,
    5517,
    6250,
    5474,
    6242,
    5395,
    6346,
    5317,
    6433,
    5221,
    6625,
    5291,
    6816,
    5325,
    6877,
    5439,
    6973,
    5570,
    6956,
    5700,
    6991,
    5744,
    6991,
    5822,
    6912,
    5918,
    6790,
    5979,
    6712,
    6049,
    6607,
    6084,
  ],
}

const neighbors = {
  0: [7, 11, 6, 2, 1, 4, 5],
  1: [0, 2, 3, 4],
  2: [0, 1, 3, 6, 14],
  3: [1, 2, 4, 10, 14, 19, 20],
  4: [0, 1, 3, 5, 20, 21],
  5: [0, 4, 21],
  6: [0, 2, 11, 13, 14, 17],
  7: [0, 8, 9, 11, 15],
  8: [7, 9, 11],
  9: [7, 8, 15],
  10: [3, 14, 18, 19],
  11: [0, 6, 7, 8, 12, 13],
  12: [11, 13],
  13: [6, 11, 12, 16, 17],
  14: [2, 3, 6, 10, 17, 18],
  15: [7, 9],
  16: [13, 17, 36, 38, 32, 48],
  17: [6, 13, 14, 16, 18, 36],
  18: [10, 14, 17, 19, 28, 36, 72],
  19: [3, 10, 18, 20, 22, 23, 72],
  20: [3, 4, 19, 21, 22],
  21: [4, 5, 20, 22, 24],
  22: [19, 20, 21, 23, 24, 72],
  23: [19, 22, 24, 25, 31, 34, 35, 72],
  24: [20, 21, 2, 23, 25],
  25: [23, 24, 26, 27, 31],
  26: [25, 27],
  27: [25, 6, 31],
  28: [18, 29, 36, 38, 72],
  29: [28, 30, 34, 72],
  30: [29, 33, 34, 35],
  31: [23, 25, 27, 33, 35],
  32: [16, 38],
  33: [30, 31, 35],
  34: [23, 29, 30, 35, 72],
  35: [23, 30, 31, 33, 34],
  36: [16, 17, 18, 28, 38],
  37: [41],
  38: [16, 28, 32, 36, 39],
  39: [38, 40, 42, 43],
  40: [39, 41],
  41: [37, 40],
  42: [39, 43, 44, 45],
  43: [39, 42, 44, 45, 71],
  44: [42, 43, 45, 46],
  45: [43, 44, 46, 64, 65],
  46: [44, 45, 47, 64],
  47: [46, 48, 53, 54, 56],
  48: [16, 47, 49, 50, 51, 53],
  49: [48, 50],
  50: [48, 49, 51, 52],
  51: [48, 50, 52, 53, 55],
  52: [50, 51, 55],
  53: [47, 48, 51, 54, 55],
  54: [47, 53, 55, 56, 57],
  55: [51, 52, 53, 54, 57],
  56: [47, 54, 57, 63],
  57: [54, 55, 56, 58, 59, 63],
  58: [57, 59, 60, 61, 62, 63],
  59: [57, 58, 60],
  60: [58, 59, 62],
  61: [58, 62, 63, 64],
  62: [58, 60, 61],
  63: [56, 57, 58, 61, 64],
  64: [45, 46, 61, 63, 65],
  65: [45, 64, 66],
  66: [65, 67],
  67: [66, 68],
  68: [67, 69],
  69: [68, 70],
  70: [69, 81],
  71: [43],
  72: [18, 19, 23, 28, 29, 34],
  73: [],
  74: [],
  75: [],
  76: [],
  77: [],
  78: [],
  79: [],
  80: [],
  81: [70, 82],
  82: [81, 84],
  83: [],
  84: [82],
}

const nextTile = {
  0: 0,
  1: 0,
  2: 0,
  3: 1,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 7,
  9: 7,
  10: 3,
  11: 0,
  12: 11,
  13: 6,
  14: 2,
  15: 7,
  16: 13,
  17: 6,
  18: 14,
  19: 3,
  20: 3,
  21: 4,
  22: 10,
  23: 19,
  24: 21,
  25: 24,
  26: 25,
  27: 25,
  28: 18,
  29: 28,
  30: 29,
  31: 23,
  32: 16,
  33: 30,
  34: 23,
  35: 23,
  36: 16,
  37: 41,
  38: 16,
  39: 38,
  40: 39,
  41: 40,
  42: 39,
  43: 39,
  44: 42,
  45: 43,
  46: 44,
  47: 46,
  48: 16,
  49: 48,
  50: 48,
  51: 48,
  52: 50,
  53: 47,
  54: 47,
  55: 51,
  56: 47,
  57: 54,
  58: 57,
  59: 57,
  60: 59,
  61: 58,
  62: 58,
  63: 56,
  64: 45,
  65: 45,
  66: 65,
  67: 66,
  68: 67,
  69: 68,
  70: 69,
  71: 43,
  72: 18,
  80: 80,
  81: 70,
  82: 81,
  83: 83,
  84: 84,
}
for (const area in areas) {
  graph.addVertex({ id: area, area: areas[area] })
}

for (const tile in neighbors) {
  neighbors[tile].map((neighbor) => graph.addEdge(graph.vertices[tile], graph.vertices[neighbor]))
}

const dijkstra = new jKstra.algos.Dijkstra(graph)

export default { graph, dijkstra }
