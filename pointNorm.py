import sys

def sumify(nums):
	max_ = [0,0]
	min_ = [sys.float_info.max,sys.float_info.max]

	lists = []
	for a in nums:
		list_=[]
		sum_ = [0,0]
		for pair in a:
			sum_[0] += pair[0]
			sum_[1] += pair[1]

			if sum_[0] >= max_[0]:
				max_[0] = sum_[0]

			if sum_[1] >= max_[1]:
				max_[1] = sum_[1]

			if sum_[0] <= min_[0]:
				min_[0] = sum_[0]

			print("%d,%d"%(sum_[1], min_[1]))
			if sum_[1] <= min_[1]:
				min_[1] = sum_[1]

			list_.append([sum_[0],sum_[1]])
		lists.append(list_)

	print(max_)
	print(min_)

	max_[0] -= min_[0]
	max_[1] -= min_[1]

	print(max_)

	for a in lists:
		for b in a:
			b[0] = (b[0]-min_[0])/max_[0]
			b[1] = (b[1]-min_[1])/max_[1]
	return lists

